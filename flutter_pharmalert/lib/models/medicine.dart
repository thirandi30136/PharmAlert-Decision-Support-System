class Medicine {
  final String id;
  final String name;
  final String category; // 'Antipyretic', 'ORS', 'Antibiotic', 'Antihistamine', 'Analgesic', 'Other'
  final String unit; // 'Tablets', 'Sachets', 'Capsules', 'Bottles'
  final int currentStock;
  final int reorderThreshold;
  final bool alertsEnabled;
  final double priceLKR;
  final String lastUpdated;

  const Medicine({
    required this.id,
    required this.name,
    required this.category,
    required this.unit,
    required this.currentStock,
    required this.reorderThreshold,
    required this.alertsEnabled,
    required this.priceLKR,
    this.lastUpdated = 'Today',
  });

  bool get isBelowReorder => currentStock < reorderThreshold;
  double get stockRatio => reorderThreshold > 0 ? currentStock / reorderThreshold : 1.0;

  Medicine copyWith({
    String? id,
    String? name,
    String? category,
    String? unit,
    int? currentStock,
    int? reorderThreshold,
    bool? alertsEnabled,
    double? priceLKR,
    String? lastUpdated,
  }) {
    return Medicine(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      unit: unit ?? this.unit,
      currentStock: currentStock ?? this.currentStock,
      reorderThreshold: reorderThreshold ?? this.reorderThreshold,
      alertsEnabled: alertsEnabled ?? this.alertsEnabled,
      priceLKR: priceLKR ?? this.priceLKR,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'unit': unit,
      'currentStock': currentStock,
      'reorderThreshold': reorderThreshold,
      'alertsEnabled': alertsEnabled,
      'priceLKR': priceLKR,
      'lastUpdated': lastUpdated,
    };
  }

  factory Medicine.fromMap(Map<String, dynamic> map, [String? docId]) {
    return Medicine(
      id: docId ?? map['id'] ?? '',
      name: map['name'] ?? '',
      category: map['category'] ?? 'Other',
      unit: map['unit'] ?? 'Units',
      currentStock: (map['currentStock'] as num?)?.toInt() ?? 0,
      reorderThreshold: (map['reorderThreshold'] as num?)?.toInt() ?? 0,
      alertsEnabled: map['alertsEnabled'] ?? true,
      priceLKR: (map['priceLKR'] as num?)?.toDouble() ?? 0.0,
      lastUpdated: map['lastUpdated'] ?? 'Today',
    );
  }
}
