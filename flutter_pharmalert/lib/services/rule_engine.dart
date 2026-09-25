import 'package:pharmalert/models/medicine.dart';
import 'package:pharmalert/models/alert_item.dart';
import 'package:pharmalert/models/environmental_signal.dart';

class EvaluationResult {
  final bool activeMonitoringFlag;
  final int monitoringFlagWeeksElapsed;
  final List<AlertItem> generatedAlerts;
  final String evaluationSummary;

  const EvaluationResult({
    required this.activeMonitoringFlag,
    required this.monitoringFlagWeeksElapsed,
    required this.generatedAlerts,
    required this.evaluationSummary,
  });
}

class RuleEngine {
  /// Port of Section 4 Epidemiological Decision Rules (Erandi et al., 2021)
  /// Evaluates inventory stock vs rainfall and search trend triggers.
  static EvaluationResult evaluateRules({
    required List<Medicine> medicines,
    required EnvironmentalSignal env,
    bool? forcedMonitoringFlag,
    int? forcedWeeksElapsed,
  }) {
    final List<AlertItem> generatedAlerts = [];

    // R1: 3-day rainfall > 50mm AND search trend up > 30% -> Start 10-week monitoring flag
    final bool r1RainSatisfied = env.threeDayRainfallMm > 50.0;
    final bool r1TrendSatisfied = env.searchTrendGrowthPercent > 30.0;
    final bool r1Triggered = r1RainSatisfied && r1TrendSatisfied;

    final bool isFlagActive = forcedMonitoringFlag ?? r1Triggered;
    final int weeksElapsed = forcedWeeksElapsed ?? env.monitoringFlagWeeksElapsed;

    for (final med in medicines) {
      if (!med.alertsEnabled) continue;

      final lowerName = med.name.toLowerCase();
      final isParacetamol =
          lowerName.contains('paracetamol') || lowerName.contains('panadol');
      final isORS = lowerName.contains('ors') ||
          lowerName.contains('jeevani') ||
          med.category == 'ORS';
      final isAntihistamine = lowerName.contains('cetirizine') ||
          lowerName.contains('chlorpheniramine') ||
          med.category == 'Antihistamine';

      // R2: Paracetamol rule (10-week lag post rainfall threshold trigger)
      if (isParacetamol) {
        final bool stockLow = med.currentStock < med.reorderThreshold;
        final bool is10WeeksElapsed = weeksElapsed >= 10;
        final bool shouldTrigger = isFlagActive && is10WeeksElapsed && stockLow;

        if (shouldTrigger) {
          const double increaseRatio = 0.20; // 20% surge recommended
          final int recommendedReorder =
              (med.reorderThreshold * (1 + increaseRatio)).round();
          final int increaseUnits = recommendedReorder - med.reorderThreshold;

          generatedAlerts.add(
            AlertItem(
              id: 'alert-r2-${med.id}',
              medicineId: med.id,
              medicineName: med.name,
              category: med.category,
              severity: 'CRITICAL',
              title: 'High Dengue Risk Detected in Colombo District',
              district: 'Colombo District',
              ruleId: 'R2',
              ruleName: 'Rule R2: Dengue 10-Week Outbreak Peak Surge',
              timestamp: 'Today, 06:00',
              status: 'active',
              reason:
                  'Anticipated dengue demand surge based on 10-week lag post rainfall threshold trigger.',
              currentStock: med.currentStock,
              currentReorder: med.reorderThreshold,
              recommendedReorder: recommendedReorder,
              recommendedIncreaseUnits: increaseUnits,
              academicCitation:
                  'Rule R2: Threshold 50mm + 10wk lag. Source: Erandi et al. (2021) / Colombo Epidemiological Unit WER',
              conditions: [
                RuleConditionCheck(
                  label: '3-Day Rainfall',
                  actualValue: '${env.threeDayRainfallMm} mm',
                  threshold: '> 50 mm',
                  satisfied: env.threeDayRainfallMm > 50,
                  description: 'Open-Meteo Colombo precipitation measurement',
                ),
                RuleConditionCheck(
                  label: 'Weeks Since Rainfall Event',
                  actualValue: 'Wk $weeksElapsed',
                  threshold: 'Monitoring window: 10 weeks',
                  satisfied: weeksElapsed >= 10,
                  description:
                      '10-week lag time identified in Erandi et al. dengue transmission cycle',
                ),
                RuleConditionCheck(
                  label: '${med.name} Stock',
                  actualValue: '${med.currentStock}',
                  threshold: '< ${med.reorderThreshold} units',
                  satisfied: stockLow,
                  description:
                      'Current inventory balance is below baseline reorder point',
                ),
              ],
            ),
          );
        }
      }

      // R3: ORS rule (+30% safety buffer for fluid replacement)
      if (isORS) {
        final bool stockLow = med.currentStock < med.reorderThreshold;
        final bool is10WeeksElapsed = weeksElapsed >= 10;
        final bool shouldTrigger = isFlagActive && is10WeeksElapsed && stockLow;

        if (shouldTrigger) {
          const double increaseRatio = 0.30; // 30% surge recommended
          final int recommendedReorder =
              (med.reorderThreshold * (1 + increaseRatio)).round();
          final int increaseUnits = recommendedReorder - med.reorderThreshold;

          generatedAlerts.add(
            AlertItem(
              id: 'alert-r3-${med.id}',
              medicineId: med.id,
              medicineName: med.name,
              category: med.category,
              severity: 'WARNING',
              title: 'Dengue Rehydration Surge Risk in Colombo',
              district: 'Colombo District',
              ruleId: 'R3',
              ruleName: 'Rule R3: ORS Outbreak Preparation',
              timestamp: 'Today, 06:00',
              status: 'active',
              reason:
                  'Dengue fever dehydration surge requires 30% safety stock increase for oral rehydration salts.',
              currentStock: med.currentStock,
              currentReorder: med.reorderThreshold,
              recommendedReorder: recommendedReorder,
              recommendedIncreaseUnits: increaseUnits,
              academicCitation:
                  'Rule R3: Threshold 50mm + 10wk lag. Source: Erandi et al. (2021) / SL Medical Council Guidelines',
              conditions: [
                RuleConditionCheck(
                  label: '3-Day Rainfall',
                  actualValue: '${env.threeDayRainfallMm} mm',
                  threshold: '> 50 mm',
                  satisfied: env.threeDayRainfallMm > 50,
                ),
                RuleConditionCheck(
                  label: 'Weeks Since Rainfall Event',
                  actualValue: 'Wk $weeksElapsed',
                  threshold: 'Monitoring window: 10 weeks',
                  satisfied: weeksElapsed >= 10,
                ),
                RuleConditionCheck(
                  label: '${med.name} Stock',
                  actualValue: '${med.currentStock}',
                  threshold: '< ${med.reorderThreshold} units',
                  satisfied: stockLow,
                ),
              ],
            ),
          );
        }
      }

      // R4: Antihistamines rule (fever search spike > 30% + rain > 30mm)
      if (isAntihistamine) {
        final bool feverTrendUp = env.feverSearchGrowthPercent > 30;
        final bool rainOver30 = env.threeDayRainfallMm > 30;
        final bool stockLow = med.currentStock < med.reorderThreshold;
        final bool shouldTrigger = feverTrendUp && rainOver30 && stockLow;

        if (shouldTrigger) {
          const double increaseRatio = 0.15; // 15% surge recommended
          final int recommendedReorder =
              (med.reorderThreshold * (1 + increaseRatio)).round();
          final int increaseUnits = recommendedReorder - med.reorderThreshold;

          generatedAlerts.add(
            AlertItem(
              id: 'alert-r4-${med.id}',
              medicineId: med.id,
              medicineName: med.name,
              category: med.category,
              severity: 'WARNING',
              title: 'Seasonal Allergy & Fever Surge in Colombo',
              district: 'Colombo District',
              ruleId: 'R4',
              ruleName: 'Rule R4: Viral Fever & Antihistamine Surge',
              timestamp: 'Today, 07:30',
              status: 'active',
              reason:
                  'Fever search intensity (+35%) and sustained rain (>30mm) indicate early symptomatic surge.',
              currentStock: med.currentStock,
              currentReorder: med.reorderThreshold,
              recommendedReorder: recommendedReorder,
              recommendedIncreaseUnits: increaseUnits,
              academicCitation:
                  'Rule R4: Search volume > 30% + Rainfall > 30mm. Source: Epidemiological Unit Colombo WER',
              conditions: [
                RuleConditionCheck(
                  label: 'Fever Search Interest',
                  actualValue: '+${env.feverSearchGrowthPercent}%',
                  threshold: '> +30%',
                  satisfied: feverTrendUp,
                ),
                RuleConditionCheck(
                  label: '3-Day Rainfall',
                  actualValue: '${env.threeDayRainfallMm} mm',
                  threshold: '> 30 mm',
                  satisfied: rainOver30,
                ),
                RuleConditionCheck(
                  label: '${med.name} Stock',
                  actualValue: '${med.currentStock}',
                  threshold: '< ${med.reorderThreshold} units',
                  satisfied: stockLow,
                ),
              ],
            ),
          );
        }
      }
    }

    String summary = 'No active dengue alert threshold triggered.';
    if (isFlagActive && weeksElapsed < 10) {
      summary =
          'Heavy rainfall detected. 10-week lag monitoring active ($weeksElapsed/10 weeks elapsed). No alerts generated yet.';
    } else if (generatedAlerts.isNotEmpty) {
      summary =
          '${generatedAlerts.length} proactive procurement alerts generated based on epidemiological triggers.';
    }

    return EvaluationResult(
      activeMonitoringFlag: isFlagActive,
      monitoringFlagWeeksElapsed: weeksElapsed,
      generatedAlerts: generatedAlerts,
      evaluationSummary: summary,
    );
  }
}
