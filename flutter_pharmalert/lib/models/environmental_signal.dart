class DailyRainfall {
  final String day;
  final double amountMm;

  const DailyRainfall({
    required this.day,
    required this.amountMm,
  });

  Map<String, dynamic> toMap() => {'day': day, 'amountMm': amountMm};
  factory DailyRainfall.fromMap(Map<String, dynamic> map) => DailyRainfall(
        day: map['day'] ?? '',
        amountMm: (map['amountMm'] as num?)?.toDouble() ?? 0.0,
      );
}

class EnvironmentalSignal {
  final String district;
  final double sevenDayRainfallMm;
  // Compatibility getter
  double get threeDayRainfallMm => sevenDayRainfallMm;

  final double rainfallThresholdMm; // 50 mm over 7 days
  final int monitoringLagWeeks; // 10 weeks
  final double searchTrendGrowthPercent; // e.g. +40%
  final double searchTrendThresholdPercent; // +30%
  final double feverSearchGrowthPercent;
  final bool activeMonitoringFlag;
  final int monitoringFlagWeeksElapsed;
  final List<DailyRainfall> dailyRainfall;
  final String lastUpdated;
  final String dataSource;

  const EnvironmentalSignal({
    required this.district,
    required this.sevenDayRainfallMm,
    this.rainfallThresholdMm = 50.0,
    this.monitoringLagWeeks = 10,
    required this.searchTrendGrowthPercent,
    this.searchTrendThresholdPercent = 30.0,
    required this.feverSearchGrowthPercent,
    required this.activeMonitoringFlag,
    required this.monitoringFlagWeeksElapsed,
    required this.dailyRainfall,
    required this.lastUpdated,
    required this.dataSource,
  });

  EnvironmentalSignal copyWith({
    String? district,
    double? sevenDayRainfallMm,
    double? threeDayRainfallMm,
    double? rainfallThresholdMm,
    int? monitoringLagWeeks,
    double? searchTrendGrowthPercent,
    double? searchTrendThresholdPercent,
    double? feverSearchGrowthPercent,
    bool? activeMonitoringFlag,
    int? monitoringFlagWeeksElapsed,
    List<DailyRainfall>? dailyRainfall,
    String? lastUpdated,
    String? dataSource,
  }) {
    final rain = sevenDayRainfallMm ?? threeDayRainfallMm ?? this.sevenDayRainfallMm;
    return EnvironmentalSignal(
      district: district ?? this.district,
      sevenDayRainfallMm: rain,
      rainfallThresholdMm: rainfallThresholdMm ?? this.rainfallThresholdMm,
      monitoringLagWeeks: monitoringLagWeeks ?? this.monitoringLagWeeks,
      searchTrendGrowthPercent: searchTrendGrowthPercent ?? this.searchTrendGrowthPercent,
      searchTrendThresholdPercent: searchTrendThresholdPercent ?? this.searchTrendThresholdPercent,
      feverSearchGrowthPercent: feverSearchGrowthPercent ?? this.feverSearchGrowthPercent,
      activeMonitoringFlag: activeMonitoringFlag ?? this.activeMonitoringFlag,
      monitoringFlagWeeksElapsed: monitoringFlagWeeksElapsed ?? this.monitoringFlagWeeksElapsed,
      dailyRainfall: dailyRainfall ?? this.dailyRainfall,
      lastUpdated: lastUpdated ?? this.lastUpdated,
      dataSource: dataSource ?? this.dataSource,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'district': district,
      'sevenDayRainfallMm': sevenDayRainfallMm,
      'threeDayRainfallMm': sevenDayRainfallMm,
      'rainfallThresholdMm': rainfallThresholdMm,
      'monitoringLagWeeks': monitoringLagWeeks,
      'searchTrendGrowthPercent': searchTrendGrowthPercent,
      'searchTrendThresholdPercent': searchTrendThresholdPercent,
      'feverSearchGrowthPercent': feverSearchGrowthPercent,
      'activeMonitoringFlag': activeMonitoringFlag,
      'monitoringFlagWeeksElapsed': monitoringFlagWeeksElapsed,
      'dailyRainfall': dailyRainfall.map((d) => d.toMap()).toList(),
      'lastUpdated': lastUpdated,
      'dataSource': dataSource,
    };
  }

  factory EnvironmentalSignal.fromMap(Map<String, dynamic> map) {
    final rain = (map['sevenDayRainfallMm'] ?? map['threeDayRainfallMm'] as num?)?.toDouble() ?? 60.0;
    return EnvironmentalSignal(
      district: map['district'] ?? 'Colombo',
      sevenDayRainfallMm: rain,
      rainfallThresholdMm: (map['rainfallThresholdMm'] as num?)?.toDouble() ?? 50.0,
      monitoringLagWeeks: (map['monitoringLagWeeks'] as num?)?.toInt() ?? 10,
      searchTrendGrowthPercent: (map['searchTrendGrowthPercent'] as num?)?.toDouble() ?? 40.0,
      searchTrendThresholdPercent: (map['searchTrendThresholdPercent'] as num?)?.toDouble() ?? 30.0,
      feverSearchGrowthPercent: (map['feverSearchGrowthPercent'] as num?)?.toDouble() ?? 35.0,
      activeMonitoringFlag: map['activeMonitoringFlag'] ?? true,
      monitoringFlagWeeksElapsed: (map['monitoringFlagWeeksElapsed'] as num?)?.toInt() ?? 10,
      dailyRainfall: (map['dailyRainfall'] as List<dynamic>? ?? [])
          .map((d) => DailyRainfall.fromMap(d as Map<String, dynamic>))
          .toList(),
      lastUpdated: map['lastUpdated'] ?? 'Today',
      dataSource: map['dataSource'] ?? 'Open-Meteo & Google Trends',
    );
  }

  static EnvironmentalSignal colomboDefault() {
    return const EnvironmentalSignal(
      district: 'Colombo',
      sevenDayRainfallMm: 60.0,
      rainfallThresholdMm: 50.0,
      monitoringLagWeeks: 10,
      searchTrendGrowthPercent: 40.0,
      searchTrendThresholdPercent: 30.0,
      feverSearchGrowthPercent: 35.0,
      activeMonitoringFlag: true,
      monitoringFlagWeeksElapsed: 10,
      dailyRainfall: [
        DailyRainfall(day: 'Mon', amountMm: 8.0),
        DailyRainfall(day: 'Tue', amountMm: 12.0),
        DailyRainfall(day: 'Wed', amountMm: 6.0),
        DailyRainfall(day: 'Thu', amountMm: 10.0),
        DailyRainfall(day: 'Fri', amountMm: 8.0),
        DailyRainfall(day: 'Sat', amountMm: 10.0),
        DailyRainfall(day: 'Sun', amountMm: 6.0),
      ],
      lastUpdated: 'Today, 06:00',
      dataSource: 'Open-Meteo & Google Trends (Colombo)',
    );
  }
}
