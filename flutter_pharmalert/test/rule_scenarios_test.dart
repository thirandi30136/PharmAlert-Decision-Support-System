import 'package:flutter_test/flutter_test.dart';
import 'package:pharmalert/models/medicine.dart';
import 'package:pharmalert/models/environmental_signal.dart';
import 'package:pharmalert/services/rule_engine.dart';
import 'package:pharmalert/services/firebase_service.dart';

void main() {
  group('Section 7.1 Academic Rule Evaluation Scenarios (Colombo, Sri Lanka)', () {
    test('Scenario 1: Heavy Rain (>50mm over 7 days) + Search Trend -> Monitoring Flag Starts, 0 Alerts at Week 2 (Lag Window)', () {
      final env = EnvironmentalSignal.colomboDefault().copyWith(
        sevenDayRainfallMm: 65.0,
        searchTrendGrowthPercent: 42.0,
        feverSearchGrowthPercent: 15.0,
        activeMonitoringFlag: true,
        monitoringFlagWeeksElapsed: 2,
      );

      final result = RuleEngine.evaluateRules(
        medicines: FirebaseService.defaultBenchmarkMedicines,
        env: env,
        forcedMonitoringFlag: true,
        forcedWeeksElapsed: 2,
      );

      expect(result.activeMonitoringFlag, isTrue);
      expect(result.monitoringFlagWeeksElapsed, equals(2));
      // Lag window is 10 weeks; at week 2, 0 dengue procurement alerts should be issued
      expect(result.generatedAlerts.length, equals(0));
    });

    test('Scenario 2: 10 Weeks Post-Rainfall (Stock Below Reorder) -> Surge Alerts Triggered (+20% Paracetamol, +30% ORS)', () {
      final env = EnvironmentalSignal.colomboDefault().copyWith(
        sevenDayRainfallMm: 60.0,
        searchTrendGrowthPercent: 40.0,
        activeMonitoringFlag: true,
        monitoringFlagWeeksElapsed: 10,
      );

      // Deficit inventory below reorder thresholds
      final medicines = FirebaseService.defaultBenchmarkMedicines.map((m) {
        if (m.name.toLowerCase().contains('paracetamol')) {
          return m.copyWith(currentStock: 450, reorderThreshold: 500, alertsEnabled: true);
        }
        if (m.name.toLowerCase().contains('ors') || m.category == 'ORS') {
          return m.copyWith(currentStock: 320, reorderThreshold: 400, alertsEnabled: true);
        }
        return m;
      }).toList();

      final result = RuleEngine.evaluateRules(
        medicines: medicines,
        env: env,
        forcedMonitoringFlag: true,
        forcedWeeksElapsed: 10,
      );

      expect(result.generatedAlerts.isNotEmpty, isTrue);

      final paraAlert = result.generatedAlerts.firstWhere((a) => a.ruleId == 'R2');
      expect(paraAlert.recommendedReorder, equals(600)); // 500 * 1.20 = 600 (+20%)
      expect(paraAlert.recommendedIncreaseUnits, equals(100));

      final orsAlert = result.generatedAlerts.firstWhere((a) => a.ruleId == 'R3');
      expect(orsAlert.recommendedReorder, equals(520)); // 400 * 1.30 = 520 (+30%)
      expect(orsAlert.recommendedIncreaseUnits, equals(120));
    });

    test('Scenario 3: Stock Already Above Reorder Level -> 0 False Alerts Generated', () {
      final env = EnvironmentalSignal.colomboDefault().copyWith(
        sevenDayRainfallMm: 60.0,
        searchTrendGrowthPercent: 40.0,
        feverSearchGrowthPercent: 15.0,
        activeMonitoringFlag: true,
        monitoringFlagWeeksElapsed: 10,
      );

      // Elevated buffer inventory
      final highStockMedicines = FirebaseService.defaultBenchmarkMedicines.map((m) {
        return m.copyWith(currentStock: m.reorderThreshold + 300);
      }).toList();

      final result = RuleEngine.evaluateRules(
        medicines: highStockMedicines,
        env: env,
        forcedMonitoringFlag: true,
        forcedWeeksElapsed: 10,
      );

      expect(result.generatedAlerts.length, equals(0));
    });
  });
}
