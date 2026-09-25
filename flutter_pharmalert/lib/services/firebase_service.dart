import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:pharmalert/models/medicine.dart';
import 'package:pharmalert/models/alert_item.dart';
import 'package:pharmalert/models/user_profile.dart';

class FirebaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Authentication
  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  Future<UserCredential> signInWithEmailPassword(String email, String password) async {
    return await _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }

  // Pharmacy ID helper
  String get pharmacyId => currentUser?.uid ?? 'perera-care-pharmacy-colombo';

  // Collection references
  CollectionReference<Map<String, dynamic>> medicinesRef(String pharmacyId) =>
      _firestore.collection('pharmacies').doc(pharmacyId).collection('medicines');

  CollectionReference<Map<String, dynamic>> alertsRef(String pharmacyId) =>
      _firestore.collection('pharmacies').doc(pharmacyId).collection('alerts');

  DocumentReference<Map<String, dynamic>> userProfileRef(String uid) =>
      _firestore.collection('users').doc(uid);

  // User Profile
  Future<UserProfile> getUserProfile(String uid) async {
    try {
      final doc = await userProfileRef(uid).get();
      if (doc.exists && doc.data() != null) {
        return UserProfile.fromMap(doc.data()!, uid);
      }
    } catch (_) {}
    return UserProfile.defaultProfile();
  }

  Future<void> saveUserProfile(UserProfile profile) async {
    await userProfileRef(profile.uid).set(profile.toMap(), SetOptions(merge: true));
  }

  // Medicines Streams & Operations
  Stream<List<Medicine>> getMedicinesStream(String pharmacyId) {
    return medicinesRef(pharmacyId).snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => Medicine.fromMap(doc.data(), doc.id)).toList();
    });
  }

  Future<void> addMedicine(String pharmacyId, Medicine med) async {
    final doc = medicinesRef(pharmacyId).doc(med.id.isNotEmpty ? med.id : null);
    await doc.set(med.toMap());
  }

  Future<void> updateMedicine(String pharmacyId, Medicine med) async {
    await medicinesRef(pharmacyId).doc(med.id).update(med.toMap());
  }

  Future<void> deleteMedicine(String pharmacyId, String medicineId) async {
    await medicinesRef(pharmacyId).doc(medicineId).delete();
  }

  Future<void> updateStock(String pharmacyId, String medicineId, int newStock) async {
    await medicinesRef(pharmacyId).doc(medicineId).update({
      'currentStock': newStock,
      'lastUpdated': 'Just now',
    });
  }

  Future<void> updateReorderThreshold(String pharmacyId, String medicineId, int newReorder) async {
    await medicinesRef(pharmacyId).doc(medicineId).update({
      'reorderThreshold': newReorder,
      'lastUpdated': 'Surge adjusted',
    });
  }

  // Alerts Management in Firestore
  Stream<List<AlertItem>> getAlertsStream(String pharmacyId) {
    return alertsRef(pharmacyId).snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => AlertItem.fromMap(doc.data(), doc.id)).toList();
    });
  }

  Future<void> saveAlert(String pharmacyId, AlertItem alert) async {
    await alertsRef(pharmacyId).doc(alert.id).set(alert.toMap(), SetOptions(merge: true));
  }

  Future<void> actionAlert({
    required String pharmacyId,
    required String alertId,
    required String medicineId,
    required int recommendedReorder,
  }) async {
    // 1. Mark alert as actioned
    await alertsRef(pharmacyId).doc(alertId).update({
      'status': 'actioned',
      'actionedAt': DateTime.now().toIso8601String(),
    });

    // 2. Adjust medicine reorder threshold to recommended level
    await medicinesRef(pharmacyId).doc(medicineId).update({
      'reorderThreshold': recommendedReorder,
      'lastUpdated': 'Surge +20% applied',
    });
  }

  Future<void> ignoreAlert(String pharmacyId, String alertId) async {
    await alertsRef(pharmacyId).doc(alertId).update({
      'status': 'ignored',
      'ignoredAt': DateTime.now().toIso8601String(),
    });
  }

  // Initial Benchmark Data Seeder
  Future<void> seedBenchmarkInventory(String pharmacyId) async {
    final batch = _firestore.batch();
    for (final med in defaultBenchmarkMedicines) {
      final docRef = medicinesRef(pharmacyId).doc(med.id);
      batch.set(docRef, med.toMap());
    }
    await batch.commit();
  }

  static final List<Medicine> defaultBenchmarkMedicines = [
    const Medicine(
      id: 'med-1',
      name: 'Paracetamol 500mg',
      category: 'Antipyretic',
      unit: 'Tablets',
      currentStock: 450,
      reorderThreshold: 500,
      alertsEnabled: true,
      priceLKR: 4.5,
      lastUpdated: 'Today, 08:30',
    ),
    const Medicine(
      id: 'med-2',
      name: 'ORS Sachets 20.5g',
      category: 'ORS',
      unit: 'Sachets',
      currentStock: 320,
      reorderThreshold: 400,
      alertsEnabled: true,
      priceLKR: 65.0,
      lastUpdated: 'Today, 08:15',
    ),
    const Medicine(
      id: 'med-3',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotic',
      unit: 'Capsules',
      currentStock: 1240,
      reorderThreshold: 800,
      alertsEnabled: false,
      priceLKR: 18.0,
      lastUpdated: 'Yesterday',
    ),
    const Medicine(
      id: 'med-4',
      name: 'Cetirizine 10mg',
      category: 'Antihistamine',
      unit: 'Tablets',
      currentStock: 45,
      reorderThreshold: 70,
      alertsEnabled: true,
      priceLKR: 12.0,
      lastUpdated: 'Today, 07:45',
    ),
    const Medicine(
      id: 'med-5',
      name: 'Panadol Syrup 100ml',
      category: 'Antipyretic',
      unit: 'Bottles',
      currentStock: 35,
      reorderThreshold: 60,
      alertsEnabled: true,
      priceLKR: 420.0,
      lastUpdated: 'Today, 06:10',
    ),
    const Medicine(
      id: 'med-6',
      name: 'Ibuprofen 400mg',
      category: 'Analgesic',
      unit: 'Tablets',
      currentStock: 580,
      reorderThreshold: 350,
      alertsEnabled: false, // Contraindicated in dengue
      priceLKR: 9.0,
      lastUpdated: '2 days ago',
    ),
    const Medicine(
      id: 'med-7',
      name: 'Vitamin C 500mg',
      category: 'Other',
      unit: 'Tablets',
      currentStock: 890,
      reorderThreshold: 500,
      alertsEnabled: true,
      priceLKR: 8.5,
      lastUpdated: 'Today, 09:00',
    ),
    const Medicine(
      id: 'med-8',
      name: 'Dextrose Saline 500ml',
      category: 'ORS',
      unit: 'Bottles',
      currentStock: 18,
      reorderThreshold: 25,
      alertsEnabled: true,
      priceLKR: 280.0,
      lastUpdated: 'Yesterday',
    ),
  ];
}
