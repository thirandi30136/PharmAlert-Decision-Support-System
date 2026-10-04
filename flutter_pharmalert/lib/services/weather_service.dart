import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:pharmalert/models/environmental_signal.dart';

class WeatherService {
  static const String _cacheKey = 'pharmalert_flutter_weather_cache';

  /// Fetches 7-day precipitation forecast for Colombo (6.93° N, 79.86° E)
  /// Calibrated to the 50 mm over 7 days epidemiological trigger threshold.
  static Future<EnvironmentalSignal> fetchColomboWeather() async {
    try {
      final uri = Uri.parse(
        'https://api.open-meteo.com/v1/forecast?latitude=6.93&longitude=79.86&daily=precipitation_sum&timezone=Asia%2FColombo',
      );

      final response = await http.get(uri).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> precip = data['daily']?['precipitation_sum'] ?? [];
        final List<dynamic> times = data['daily']?['time'] ?? [];

        // Sum next 7 days of daily precipitation
        final next7Days = precip.take(7).map((e) => (e as num?)?.toDouble() ?? 0.0).toList();
        final double sum7 = next7Days.fold(0.0, (prev, element) => prev + element);
        final double roundedSum = (sum7 * 10).round() / 10.0;

        final List<DailyRainfall> dailyRainfall = [];
        for (int i = 0; i < next7Days.length; i++) {
          String dayLabel = 'Day ${i + 1}';
          if (i < times.length && times[i] is String) {
            try {
              final d = DateTime.parse(times[i]);
              const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              dayLabel = daysOfWeek[d.weekday - 1];
            } catch (_) {}
          }
          dailyRainfall.add(DailyRainfall(
            day: dayLabel,
            amountMm: (next7Days[i] * 10).round() / 10.0,
          ));
        }

        final signal = EnvironmentalSignal(
          district: 'Colombo',
          sevenDayRainfallMm: roundedSum,
          rainfallThresholdMm: 50.0,
          monitoringLagWeeks: 10,
          searchTrendGrowthPercent: 40.0,
          searchTrendThresholdPercent: 30.0,
          feverSearchGrowthPercent: 35.0,
          activeMonitoringFlag: roundedSum > 50.0,
          monitoringFlagWeeksElapsed: 10,
          dailyRainfall: dailyRainfall,
          lastUpdated: 'Today, ${DateTime.now().hour.toString().padLeft(2, '0')}:${DateTime.now().minute.toString().padLeft(2, '0')}',
          dataSource: 'Open-Meteo API (Colombo 6.93°N)',
        );

        // Cache response locally
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_cacheKey, json.encode(signal.toMap()));

        return signal;
      } else {
        throw Exception('Open-Meteo returned status code ${response.statusCode}');
      }
    } catch (e) {
      // Attempt read from cache, or return benchmark default
      try {
        final prefs = await SharedPreferences.getInstance();
        final cached = prefs.getString(_cacheKey);
        if (cached != null) {
          final map = json.decode(cached);
          return EnvironmentalSignal.fromMap(map);
        }
      } catch (_) {}

      return EnvironmentalSignal.colomboDefault();
    }
  }
}
