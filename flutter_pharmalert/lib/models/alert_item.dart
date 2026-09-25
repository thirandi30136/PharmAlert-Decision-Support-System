class RuleConditionCheck {
  final String label;
  final dynamic actualValue;
  final dynamic threshold;
  final String? unit;
  final bool satisfied;
  final String? description;

  const RuleConditionCheck({
    required this.label,
    required this.actualValue,
    required this.threshold,
    this.unit,
    required this.satisfied,
    this.description,
  });

  Map<String, dynamic> toMap() {
    return {
      'label': label,
      'actualValue': actualValue,
      'threshold': threshold,
      'unit': unit,
      'satisfied': satisfied,
      'description': description,
    };
  }

  factory RuleConditionCheck.fromMap(Map<String, dynamic> map) {
    return RuleConditionCheck(
      label: map['label'] ?? '',
      actualValue: map['actualValue'] ?? '',
      threshold: map['threshold'] ?? '',
      unit: map['unit'],
      satisfied: map['satisfied'] ?? false,
      description: map['description'],
    );
  }
}

class AlertItem {
  final String id;
  final String medicineId;
  final String medicineName;
  final String category;
  final String severity; // 'CRITICAL', 'WARNING', 'INFO'
  final String title;
  final String district;
  final String ruleId; // 'R1', 'R2', 'R3', 'R4'
  final String ruleName;
  final String timestamp;
  final String status; // 'active', 'actioned', 'ignored'
  final List<RuleConditionCheck> conditions;
  final int currentStock;
  final int currentReorder;
  final int recommendedReorder;
  final int recommendedIncreaseUnits;
  final String reason;
  final String academicCitation;

  const AlertItem({
    required this.id,
    required this.medicineId,
    required this.medicineName,
    required this.category,
    required this.severity,
    required this.title,
    required this.district,
    required this.ruleId,
    required this.ruleName,
    required this.timestamp,
    required this.status,
    required this.conditions,
    required this.currentStock,
    required this.currentReorder,
    required this.recommendedReorder,
    required this.recommendedIncreaseUnits,
    required this.reason,
    required this.academicCitation,
  });

  AlertItem copyWith({
    String? status,
    int? currentReorder,
    int? recommendedReorder,
  }) {
    return AlertItem(
      id: id,
      medicineId: medicineId,
      medicineName: medicineName,
      category: category,
      severity: severity,
      title: title,
      district: district,
      ruleId: ruleId,
      ruleName: ruleName,
      timestamp: timestamp,
      status: status ?? this.status,
      conditions: conditions,
      currentStock: currentStock,
      currentReorder: currentReorder ?? this.currentReorder,
      recommendedReorder: recommendedReorder ?? this.recommendedReorder,
      recommendedIncreaseUnits: recommendedIncreaseUnits,
      reason: reason,
      academicCitation: academicCitation,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'medicineId': medicineId,
      'medicineName': medicineName,
      'category': category,
      'severity': severity,
      'title': title,
      'district': district,
      'ruleId': ruleId,
      'ruleName': ruleName,
      'timestamp': timestamp,
      'status': status,
      'conditions': conditions.map((c) => c.toMap()).toList(),
      'currentStock': currentStock,
      'currentReorder': currentReorder,
      'recommendedReorder': recommendedReorder,
      'recommendedIncreaseUnits': recommendedIncreaseUnits,
      'reason': reason,
      'academicCitation': academicCitation,
    };
  }

  factory AlertItem.fromMap(Map<String, dynamic> map, [String? docId]) {
    return AlertItem(
      id: docId ?? map['id'] ?? '',
      medicineId: map['medicineId'] ?? '',
      medicineName: map['medicineName'] ?? '',
      category: map['category'] ?? '',
      severity: map['severity'] ?? 'INFO',
      title: map['title'] ?? '',
      district: map['district'] ?? 'Colombo District',
      ruleId: map['ruleId'] ?? 'R1',
      ruleName: map['ruleName'] ?? '',
      timestamp: map['timestamp'] ?? 'Today',
      status: map['status'] ?? 'active',
      conditions: (map['conditions'] as List<dynamic>? ?? [])
          .map((c) => RuleConditionCheck.fromMap(c as Map<String, dynamic>))
          .toList(),
      currentStock: (map['currentStock'] as num?)?.toInt() ?? 0,
      currentReorder: (map['currentReorder'] as num?)?.toInt() ?? 0,
      recommendedReorder: (map['recommendedReorder'] as num?)?.toInt() ?? 0,
      recommendedIncreaseUnits: (map['recommendedIncreaseUnits'] as num?)?.toInt() ?? 0,
      reason: map['reason'] ?? '',
      academicCitation: map['academicCitation'] ?? '',
    );
  }
}
