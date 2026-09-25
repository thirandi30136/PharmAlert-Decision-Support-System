export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Medicine {
  id: string;
  name: string;
  category: 'Antipyretic' | 'ORS' | 'Antibiotic' | 'Antihistamine' | 'Analgesic' | 'Other';
  unit: string; // e.g. "Tablets", "Sachets", "Capsules", "Bottles"
  currentStock: number;
  reorderThreshold: number;
  alertsEnabled: boolean;
  priceLKR: number;
  lastUpdated?: string;
}

export interface RuleConditionCheck {
  label: string;
  actualValue: string | number;
  threshold: string | number;
  unit?: string;
  satisfied: boolean;
  description?: string;
}

export interface AlertItem {
  id: string;
  medicineId: string;
  medicineName: string;
  category: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  district: string;
  ruleId: 'R1' | 'R2' | 'R3' | 'R4';
  ruleName: string;
  timestamp: string;
  status: 'active' | 'actioned' | 'ignored';
  conditions: RuleConditionCheck[];
  currentStock: number;
  currentReorder: number;
  recommendedReorder: number;
  recommendedIncreaseUnits: number;
  reason: string;
  academicCitation: string;
}

export interface EnvironmentalSignal {
  district: string;
  threeDayRainfallMm: number;
  rainfallThresholdMm: number; // 50mm
  monitoringLagWeeks: number; // 10 weeks
  searchTrendGrowthPercent: number; // e.g. +40%
  searchTrendThresholdPercent: number; // +30%
  feverSearchGrowthPercent: number;
  activeMonitoringFlag: boolean;
  monitoringFlagWeeksElapsed: number; // 10
  dailyRainfall: { day: string; amountMm: number }[];
  lastUpdated: string;
  dataSource: string;
}

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  pharmacyName: string;
  district: string;
  role: string;
}

export type ActiveTab = 'home' | 'alerts' | 'inventory' | 'settings';

export type ViewMode = 'iphone' | 'mobile' | 'responsive';
