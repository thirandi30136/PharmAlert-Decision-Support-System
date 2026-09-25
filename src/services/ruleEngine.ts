import { Medicine, AlertItem, EnvironmentalSignal } from '../types';

export interface EvaluationResult {
  activeMonitoringFlag: boolean;
  monitoringFlagWeeksElapsed: number;
  generatedAlerts: AlertItem[];
  evaluationSummary: string;
}

/**
 * Port of backend/rules/business_rules.py & backend/rules/rule_engine.py
 * Implements Section 4 exactly as specified.
 */
export function evaluateRules(
  medicines: Medicine[],
  env: EnvironmentalSignal,
  customState?: {
    forcedMonitoringFlag?: boolean;
    forcedWeeksElapsed?: number;
  }
): EvaluationResult {
  const generatedAlerts: AlertItem[] = [];

  // R1: 3-day rainfall > 50mm AND search trend up > 30% -> Start 10-week monitoring flag
  const r1RainSatisfied = env.threeDayRainfallMm > 50;
  const r1TrendSatisfied = env.searchTrendGrowthPercent > 30;
  const r1Triggered = r1RainSatisfied && r1TrendSatisfied;

  const isFlagActive =
    customState?.forcedMonitoringFlag !== undefined
      ? customState.forcedMonitoringFlag
      : r1Triggered;

  const weeksElapsed =
    customState?.forcedWeeksElapsed !== undefined
      ? customState.forcedWeeksElapsed
      : env.monitoringFlagWeeksElapsed;

  // Evaluate per medicine with alerts enabled
  for (const med of medicines) {
    if (!med.alertsEnabled) continue;

    const lowerName = med.name.toLowerCase();
    const isParacetamol =
      lowerName.includes('paracetamol') || lowerName.includes('panadol');
    const isORS =
      lowerName.includes('ors') || lowerName.includes('jeevani') || med.category === 'ORS';
    const isAntihistamine =
      lowerName.includes('cetirizine') ||
      lowerName.includes('chlorpheniramine') ||
      med.category === 'Antihistamine';

    // R2: Paracetamol rule
    if (isParacetamol) {
      const stockLow = med.currentStock < med.reorderThreshold;
      const is10WeeksElapsed = weeksElapsed >= 10;
      const shouldTrigger = isFlagActive && is10WeeksElapsed && stockLow;

      if (shouldTrigger) {
        const increaseRatio = 0.2; // 20%
        const recommendedReorder = Math.round(med.reorderThreshold * (1 + increaseRatio));
        const increaseUnits = recommendedReorder - med.reorderThreshold;

        generatedAlerts.push({
          id: `alert-r2-${med.id}`,
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
          reason: 'Anticipated dengue demand surge based on 10-week lag post rainfall threshold trigger.',
          currentStock: med.currentStock,
          currentReorder: med.reorderThreshold,
          recommendedReorder: recommendedReorder,
          recommendedIncreaseUnits: increaseUnits,
          academicCitation: 'Rule R2: Threshold 50mm + 10wk lag. Source: Erandi et al. (2021) / Colombo Epidemiological Unit WER',
          conditions: [
            {
              label: '3-Day Rainfall',
              actualValue: `${env.threeDayRainfallMm} mm`,
              threshold: '> 50 mm',
              satisfied: env.threeDayRainfallMm > 50,
              description: 'Open-Meteo Colombo precipitation measurement',
            },
            {
              label: 'Weeks Since Rainfall Event',
              actualValue: `Wk ${weeksElapsed}`,
              threshold: 'Monitoring window: 10 weeks',
              satisfied: weeksElapsed >= 10,
              description: '10-week lag time identified in Erandi et al. dengue transmission cycle',
            },
            {
              label: `${med.name} Stock`,
              actualValue: med.currentStock,
              threshold: `< ${med.reorderThreshold} units`,
              satisfied: stockLow,
              description: 'Current inventory balance is below baseline reorder point',
            },
          ],
        });
      }
    }

    // R3: ORS rule
    if (isORS) {
      const stockLow = med.currentStock < med.reorderThreshold;
      const is10WeeksElapsed = weeksElapsed >= 10;
      const shouldTrigger = isFlagActive && is10WeeksElapsed && stockLow;

      if (shouldTrigger) {
        const increaseRatio = 0.3; // 30%
        const recommendedReorder = Math.round(med.reorderThreshold * (1 + increaseRatio));
        const increaseUnits = recommendedReorder - med.reorderThreshold;

        generatedAlerts.push({
          id: `alert-r3-${med.id}`,
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
          reason: 'Dengue fever dehydration surge requires 30% safety stock increase for oral rehydration salts.',
          currentStock: med.currentStock,
          currentReorder: med.reorderThreshold,
          recommendedReorder: recommendedReorder,
          recommendedIncreaseUnits: increaseUnits,
          academicCitation: 'Rule R3: Threshold 50mm + 10wk lag. Source: Erandi et al. (2021) / SL Medical Council Guidelines',
          conditions: [
            {
              label: '3-Day Rainfall',
              actualValue: `${env.threeDayRainfallMm} mm`,
              threshold: '> 50 mm',
              satisfied: env.threeDayRainfallMm > 50,
            },
            {
              label: 'Weeks Since Rainfall Event',
              actualValue: `Wk ${weeksElapsed}`,
              threshold: 'Monitoring window: 10 weeks',
              satisfied: weeksElapsed >= 10,
            },
            {
              label: `${med.name} Stock`,
              actualValue: med.currentStock,
              threshold: `< ${med.reorderThreshold} units`,
              satisfied: stockLow,
            },
          ],
        });
      }
    }

    // R4: Fever search volume up > 30% AND rainfall > 30mm -> Increase Cetirizine/antihistamine reorder by 15%
    if (isAntihistamine) {
      const feverTrendUp = env.feverSearchGrowthPercent > 30;
      const rainOver30 = env.threeDayRainfallMm > 30;
      const stockLow = med.currentStock < med.reorderThreshold;
      const shouldTrigger = feverTrendUp && rainOver30 && stockLow;

      if (shouldTrigger) {
        const increaseRatio = 0.15; // 15%
        const recommendedReorder = Math.round(med.reorderThreshold * (1 + increaseRatio));
        const increaseUnits = recommendedReorder - med.reorderThreshold;

        generatedAlerts.push({
          id: `alert-r4-${med.id}`,
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
          reason: 'Fever search intensity (+35%) and sustained rain (>30mm) indicate early symptomatic surge.',
          currentStock: med.currentStock,
          currentReorder: med.reorderThreshold,
          recommendedReorder: recommendedReorder,
          recommendedIncreaseUnits: increaseUnits,
          academicCitation: 'Rule R4: Search volume > 30% + Rainfall > 30mm. Source: Epidemiological Unit Colombo WER',
          conditions: [
            {
              label: 'Fever Search Interest',
              actualValue: `+${env.feverSearchGrowthPercent}%`,
              threshold: '> +30%',
              satisfied: feverTrendUp,
            },
            {
              label: '3-Day Rainfall',
              actualValue: `${env.threeDayRainfallMm} mm`,
              threshold: '> 30 mm',
              satisfied: rainOver30,
            },
            {
              label: `${med.name} Stock`,
              actualValue: med.currentStock,
              threshold: `< ${med.reorderThreshold} units`,
              satisfied: stockLow,
            },
          ],
        });
      }
    }
  }

  let summary = 'No active dengue alert threshold triggered.';
  if (isFlagActive && weeksElapsed < 10) {
    summary = `Heavy rainfall detected. 10-week lag monitoring active (${weeksElapsed}/10 weeks elapsed). No alerts generated yet.`;
  } else if (generatedAlerts.length > 0) {
    summary = `${generatedAlerts.length} proactive procurement alerts generated based on epidemiological triggers.`;
  }

  return {
    activeMonitoringFlag: isFlagActive,
    monitoringFlagWeeksElapsed: weeksElapsed,
    generatedAlerts,
    evaluationSummary: summary,
  };
}
