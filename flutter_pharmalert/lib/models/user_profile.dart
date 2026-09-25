class UserProfile {
  final String uid;
  final String name;
  final String email;
  final String initials;
  final String pharmacyName;
  final String district;
  final String role;

  const UserProfile({
    this.uid = 'user-sme-colombo-1',
    required this.name,
    required this.email,
    required this.initials,
    required this.pharmacyName,
    required this.district,
    this.role = 'Managing Pharmacist',
  });

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'name': name,
      'email': email,
      'initials': initials,
      'pharmacyName': pharmacyName,
      'district': district,
      'role': role,
    };
  }

  factory UserProfile.fromMap(Map<String, dynamic> map, [String? uid]) {
    return UserProfile(
      uid: uid ?? map['uid'] ?? 'user-sme-colombo-1',
      name: map['name'] ?? 'Dr. Kanishka Perera',
      email: map['email'] ?? 'kanishka@ceylonmed.lk',
      initials: map['initials'] ?? 'KP',
      pharmacyName: map['pharmacyName'] ?? 'Perera Care Pharmacy',
      district: map['district'] ?? 'Colombo District',
      role: map['role'] ?? 'Managing Pharmacist',
    );
  }

  static UserProfile defaultProfile() {
    return const UserProfile(
      uid: 'user-sme-colombo-1',
      name: 'Dr. Kanishka Perera',
      email: 'kanishka@ceylonmed.lk',
      initials: 'KP',
      pharmacyName: 'Perera Care Pharmacy',
      district: 'Colombo District',
      role: 'Managing Pharmacist',
    );
  }
}
