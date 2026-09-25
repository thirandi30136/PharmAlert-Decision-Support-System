import 'package:flutter/material.dart';
import 'package:pharmalert/models/medicine.dart';
import 'package:pharmalert/models/alert_item.dart';
import 'package:pharmalert/models/environmental_signal.dart';
import 'package:pharmalert/models/user_profile.dart';
import 'package:pharmalert/services/firebase_service.dart';
import 'package:pharmalert/services/weather_service.dart';
import 'package:pharmalert/services/rule_engine.dart';

class AppProvider extends ChangeNotifier {
  final FirebaseService _firebaseService = FirebaseService();

  // State
  UserProfile _user = UserProfile.defaultProfile();
  List<Medicine> _medicines = List.from(FirebaseService.defaultBenchmarkMedicines);
  List<AlertItem> _alerts = [];
  EnvironmentalSignal _environmentalSignal = EnvironmentalSignal.colomboDefault();
  
  bool _isLoggedIn = true;
  bool _isWeatherLoading = false;
  String? _weatherError;
  String? _toastMessage;
  String? _activeScenarioName;
  int _currentTabIndex = 0; // 0: Dashboard, 1: Alerts, 2: Inventory, 3: Settings

  // Getters
  UserProfile get user => _user;
  List<Medicine> get medicines => _medicines;
  List<AlertItem> get alerts => _alerts;
  List<AlertItem> get activeAlerts => _alerts.where((a) => a.status == 'active').toList();
  EnvironmentalSignal get environmentalSignal => _environmentalSignal;
  bool get isLoggedIn => _isLoggedIn;
  bool get isWeatherLoading => _isWeatherLoading;
  String? get weatherError => _weatherError;
  String? get toastMessage => _toastMessage;
  String? get activeScenarioName => _activeScenarioName;
  int get currentTabIndex => _currentTabIndex;

  AppProvider() {
    _initApp();
  }

  void _initApp() {
    // Run rule engine with initial data
    _evaluateAndRefreshAlerts();
    // Fetch live weather
    refreshWeather();
  }

  void setTabIndex(int index) {
    _currentTabIndex = index;
    notifyListeners();
  }

  void showToast(String message) {
    _toastMessage = message;
    notifyListeners();
    Future.delayed(const Duration(seconds: 3), () {
      if (_toastMessage == message) {
        _toastMessage = null;
        notifyListeners();
      }
    });
  }

  // Weather Sync
  Future<void> refreshWeather() async {
    _isWeatherLoading = true;
    _weatherError = null;
    notifyListeners();

    try {
      final signal = await WeatherService.fetchColomboWeather();
      _environmentalSignal = signal;
      _evaluateAndRefreshAlerts();
      showToast('Synced Colombo Open-Meteo precipitation data');
    } catch (e) {
      _weatherError = 'Live weather unreachable. Using calibrated benchmark.';
      showToast(_weatherError!);
    } finally {
      _isWeatherLoading = false;
      notifyListeners();
    }
  }

  // Inventory Operations
  void addMedicine(Medicine med) {
    _medicines.add(med);
    _evaluateAndRefreshAlerts();
    showToast('Added ${med.name} to inventory');
    notifyListeners();
  }

  void updateMedicine(Medicine updated) {
    final idx = _medicines.indexWhere((m) => m.id == updated.id);
    if (idx != -1) {
      _medicines[idx] = updated;
      _evaluateAndRefreshAlerts();
      showToast('Updated ${updated.name}');
      notifyListeners();
    }
  }

  void deleteMedicine(String id) {
    _medicines.removeWhere((m) => m.id == id);
    _alerts.removeWhere((a) => a.medicineId == id);
    _evaluateAndRefreshAlerts();
    showToast('Medicine removed from inventory');
    notifyListeners();
  }

  void updateStock(String id, int delta) {
    final idx = _medicines.indexWhere((m) => m.id == id);
    if (idx != -1) {
      final newStock = (_medicines[idx].currentStock + delta).clamp(0, 99999);
      _medicines[idx] = _medicines[idx].copyWith(
        currentStock: newStock,
        lastUpdated: 'Just now',
      );
      _evaluateAndRefreshAlerts();
      notifyListeners();
    }
  }

  // Alert Actions
  void applyRecommendedReorder(AlertItem alert) {
    // 1. Update medicine threshold
    final idx = _medicines.indexWhere((m) => m.id == alert.medicineId);
    if (idx != -1) {
      _medicines[idx] = _medicines[idx].copyWith(
        reorderThreshold: alert.recommendedReorder,
        lastUpdated: 'Surge +${alert.recommendedIncreaseUnits} applied',
      );
    }

    // 2. Mark alert actioned
    final alertIdx = _alerts.indexWhere((a) => a.id == alert.id);
    if (alertIdx != -1) {
      _alerts[alertIdx] = _alerts[alertIdx].copyWith(
        status: 'actioned',
        currentReorder: alert.recommendedReorder,
      );
    }

    showToast('Reorder threshold updated to ${alert.recommendedReorder} units');
    notifyListeners();
  }

  void ignoreAlert(String alertId) {
    final alertIdx = _alerts.indexWhere((a) => a.id == alertId);
    if (alertIdx != -1) {
      _alerts[alertIdx] = _alerts[alertIdx].copyWith(status: 'ignored');
      showToast('Alert archived');
      notifyListeners();
    }
  }

  // Rule Evaluation
  void _evaluateAndRefreshAlerts({bool? forcedMonitoringFlag, int? forcedWeeksElapsed}) {
    final result = RuleEngine.evaluateRules(
      medicines: _medicines,
      env: _environmentalSignal,
      forcedMonitoringFlag: forcedMonitoringFlag,
      forcedWeeksElapsed: forcedWeeksElapsed,
    );

    // Merge preserves already actioned/ignored statuses if applicable
    final Map<String, AlertItem> existingMap = {for (var a in _alerts) a.id: a};
    final List<AlertItem> merged = [];

    for (final generated in result.generatedAlerts) {
      if (existingMap.containsKey(generated.id)) {
        final existing = existingMap[generated.id]!;
        if (existing.status == 'actioned' || existing.status == 'ignored') {
          merged.add(existing);
        } else {
          merged.add(generated);
        }
      } else {
        merged.add(generated);
      }
    }

    _alerts = merged;
    notifyListeners();
  }

  // Section 7.1 Academic Test Scenarios Runner
  void runScenario({
    required String name,
    required double rainfallMm,
    required double searchSpikePercent,
    required int weeksElapsed,
    required bool flagActive,
    required double feverSearchPercent,
  }) {
    _activeScenarioName = name;
    _environmentalSignal = _environmentalSignal.copyWith(
      threeDayRainfallMm: rainfallMm,
      searchTrendGrowthPercent: searchSpikePercent,
      monitoringFlagWeeksElapsed: weeksElapsed,
      activeMonitoringFlag: flagActive,
      feverSearchGrowthPercent: feverSearchPercent,
      lastUpdated: 'Scenario Simulation',
      dataSource: 'Section 7.1 Test Matrix: $name',
    );

    _evaluateAndRefreshAlerts(
      forcedMonitoringFlag: flagActive,
      forcedWeeksElapsed: weeksElapsed,
    );

    showToast('Activated: $name');
    notifyListeners();
  }

  void resetToDefault() {
    _medicines = List.from(FirebaseService.defaultBenchmarkMedicines);
    _environmentalSignal = EnvironmentalSignal.colomboDefault();
    _activeScenarioName = null;
    _evaluateAndRefreshAlerts();
    showToast('Reset to clean research benchmark inventory');
    notifyListeners();
  }

  void login() {
    _isLoggedIn = true;
    notifyListeners();
  }

  void logout() {
    _isLoggedIn = false;
    notifyListeners();
  }
}
