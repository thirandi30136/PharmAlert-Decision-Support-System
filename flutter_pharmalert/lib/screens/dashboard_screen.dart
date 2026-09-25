import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pharmalert/providers/app_provider.dart';
import 'package:pharmalert/models/alert_item.dart';
import 'package:pharmalert/screens/alert_detail_screen.dart';
import 'package:pharmalert/widgets/rule_test_dialog.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final user = provider.user;
    final env = provider.environmentalSignal;
    final activeAlerts = provider.activeAlerts;
    final medicines = provider.medicines;
    final belowReorderMeds = medicines.where((m) => m.currentStock < m.reorderThreshold).toList();
    final isHighRisk = env.threeDayRainfallMm > 50 && env.searchTrendGrowthPercent > 30;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F766E),
        elevation: 2,
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.18),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white.withOpacity(0.25)),
              ),
              child: const Center(
                child: Text(
                  '+',
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    const Text(
                      'PharmAlert',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: const Color(0xFF14B8A6).withOpacity(0.25),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF5EEAD4).withOpacity(0.4)),
                      ),
                      child: const Text(
                        'SME DSS',
                        style: TextStyle(color: Color(0xFFCCFBF1), fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 11, color: Color(0xFF5EEAD4)),
                    const SizedBox(width: 3),
                    Text(
                      user.district,
                      style: TextStyle(color: Colors.teal.shade100, fontSize: 11, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () => provider.setTabIndex(1), // Alerts tab
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.notifications_outlined, color: Colors.white),
                if (activeAlerts.isNotEmpty)
                  Positioned(
                    right: -2,
                    top: -2,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Color(0xFFDC2626),
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                      child: Text(
                        '${activeAlerts.length}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 14),
            child: GestureDetector(
              onTap: () => provider.setTabIndex(3), // Settings
              child: CircleAvatar(
                radius: 16,
                backgroundColor: const Color(0xFF0D5D56),
                child: Text(
                  user.initials,
                  style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: provider.refreshWeather,
        color: const Color(0xFF0F766E),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 90),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Active scenario test banner
              if (provider.activeScenarioName != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.auto_awesome, color: Color(0xFF059669), size: 16),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          provider.activeScenarioName!,
                          style: const TextStyle(color: Color(0xFF065F46), fontSize: 12, fontWeight: FontWeight.w600),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      TextButton(
                        onPressed: () => showDialog(
                          context: context,
                          builder: (_) => const RuleTestDialog(),
                        ),
                        child: const Text('Test Suite', style: TextStyle(color: Color(0xFF0F766E), fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),

              // Greeting Header
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Good morning, ${user.name.split(' ').first}',
                        style: const TextStyle(color: Color(0xFF0F172A), fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.4),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Saturday, 25 July · ${user.pharmacyName}',
                        style: const TextStyle(color: Color(0xFF64748B), fontSize: 12, fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                  OutlinedButton.icon(
                    onPressed: provider.isWeatherLoading ? null : provider.refreshWeather,
                    icon: provider.isWeatherLoading
                        ? const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF0F766E)))
                        : const Icon(Icons.refresh, size: 14, color: Color(0xFF0F766E)),
                    label: Text(
                      provider.isWeatherLoading ? 'Syncing' : 'Live Weather',
                      style: const TextStyle(color: Color(0xFF0F766E), fontSize: 11, fontWeight: FontWeight.w700),
                    ),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      side: const BorderSide(color: Color(0xFFCCFBF1)),
                      backgroundColor: const Color(0xFFF0FDFA),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // High-Impact Epidemiological Threat Banner (Figure 2)
              Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFFF1F2), Color(0xFFFEF2F2), Color(0xFFFFF7ED)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: const Color(0xFFFECDD3)),
                  boxShadow: [
                    BoxShadow(color: Colors.red.shade900.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(colors: [Color(0xFFEF4444), Color(0xFFE11D48)]),
                                borderRadius: BorderRadius.circular(14),
                                boxShadow: [
                                  BoxShadow(color: Colors.red.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 3)),
                                ],
                              ),
                              child: const Icon(Icons.warning_amber_rounded, color: Colors.white, size: 24),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'EPIDEMIOLOGICAL SURGE',
                                  style: TextStyle(color: Color(0xFFDC2626), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 0.8),
                                ),
                                Row(
                                  children: [
                                    const Text(
                                      'Dengue Risk ',
                                      style: TextStyle(color: Color(0xFF0F172A), fontSize: 20, fontWeight: FontWeight.w900),
                                    ),
                                    Text(
                                      isHighRisk ? 'HIGH' : 'ELEVATED',
                                      style: const TextStyle(color: Color(0xFFDC2626), fontSize: 20, fontWeight: FontWeight.w900),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDC2626),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            'ACTION NEEDED',
                            style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Metric chips
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            icon: Icons.water_drop_outlined,
                            iconColor: const Color(0xFF0284C7),
                            label: '3-Day Rain',
                            value: '${env.threeDayRainfallMm.toStringAsFixed(0)}mm',
                            subtext: '> 50mm limit',
                            isAlert: env.threeDayRainfallMm > 50,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildMetricCard(
                            icon: Icons.trending_up,
                            iconColor: const Color(0xFFDC2626),
                            label: 'Searches',
                            value: '+${env.searchTrendGrowthPercent.toStringAsFixed(0)}%',
                            subtext: '> 30% surge',
                            isAlert: env.searchTrendGrowthPercent > 30,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildMetricCard(
                            icon: Icons.medication_outlined,
                            iconColor: const Color(0xFFD97706),
                            label: 'Deficit',
                            value: '${belowReorderMeds.length} Meds',
                            subtext: 'Reorder alerts',
                            isAlert: belowReorderMeds.isNotEmpty,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    InkWell(
                      onTap: () => provider.setTabIndex(1),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDC2626).withOpacity(0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFECDD3)),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Review recommended procurement adjustments',
                              style: TextStyle(color: Color(0xFFB91C1C), fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                            Icon(Icons.arrow_forward_ios, size: 12, color: Color(0xFFB91C1C)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Bento Row (Figure 2)
              Row(
                children: [
                  Expanded(
                    child: _buildBentoStat(
                      title: 'Active Alerts',
                      value: '${activeAlerts.length}',
                      subtitle: 'Procurement flags',
                      color: const Color(0xFFDC2626),
                      onTap: () => provider.setTabIndex(1),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildBentoStat(
                      title: 'Below Reorder',
                      value: '${belowReorderMeds.length}',
                      subtitle: 'Under baseline',
                      color: const Color(0xFFD97706),
                      onTap: () => provider.setTabIndex(2),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildBentoStat(
                      title: 'Stocked Items',
                      value: '${medicines.length - belowReorderMeds.length}',
                      subtitle: 'Adequate stock',
                      color: const Color(0xFF0F766E),
                      onTap: () => provider.setTabIndex(2),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Active Surge Alerts Section
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text(
                    'Active Dengue Alerts',
                    style: TextStyle(color: Color(0xFF0F172A), fontSize: 16, fontWeight: FontWeight.w800),
                  ),
                  TextButton(
                    onPressed: () => provider.setTabIndex(1),
                    child: const Text(
                      'See all',
                      style: TextStyle(color: Color(0xFF0F766E), fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),

              if (activeAlerts.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: const Center(
                    child: Text(
                      'No active alerts. Inventory is aligned with current demand.',
                      style: TextStyle(color: Color(0xFF64748B), fontSize: 13),
                      textAlign: TextAlign.center,
                    ),
                  ),
                )
              else
                Column(
                  children: activeAlerts.take(2).map((alert) => _buildAlertCard(context, alert, provider)).toList(),
                ),

              const SizedBox(height: 20),

              // Attention Items (Horizontal scroll)
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text(
                    'Items Needing Attention',
                    style: TextStyle(color: Color(0xFF0F172A), fontSize: 16, fontWeight: FontWeight.w800),
                  ),
                  TextButton(
                    onPressed: () => provider.setTabIndex(2),
                    child: const Text(
                      'Full inventory',
                      style: TextStyle(color: Color(0xFF0F766E), fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),

              SizedBox(
                height: 130,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: belowReorderMeds.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 10),
                  itemBuilder: (context, idx) {
                    final med = belowReorderMeds[idx];
                    return Container(
                      width: 160,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                med.name,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                              Text(
                                med.category,
                                style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                              ),
                            ],
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${med.currentStock} ${med.unit}',
                                    style: const TextStyle(color: Color(0xFFDC2626), fontWeight: FontWeight.w900, fontSize: 13),
                                  ),
                                  Text(
                                    'Min: ${med.reorderThreshold}',
                                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
                                  ),
                                ],
                              ),
                              IconButton.filled(
                                onPressed: () => provider.updateStock(med.id, 50),
                                icon: const Icon(Icons.add, size: 14),
                                style: IconButton.styleFrom(
                                  backgroundColor: const Color(0xFF0F766E),
                                  padding: const EdgeInsets.all(6),
                                  minimumSize: const Size(28, 28),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
    required String subtext,
    required bool isAlert,
  }) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isAlert ? const Color(0xFFFECDD3) : const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 12, color: iconColor),
              const SizedBox(width: 4),
              Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w500)),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: isAlert ? const Color(0xFFDC2626) : const Color(0xFF0F172A),
              fontSize: 13,
              fontWeight: FontWeight.w800,
            ),
          ),
          Text(subtext, style: TextStyle(color: isAlert ? const Color(0xFFDC2626) : const Color(0xFF94A3B8), fontSize: 9)),
        ],
      ),
    );
  }

  Widget _buildBentoStat({
    required String title,
    required String value,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text(value, style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.w900)),
            Text(subtitle, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 9)),
          ],
        ),
      ),
    );
  }

  Widget _buildAlertCard(BuildContext context, AlertItem alert, AppProvider provider) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFECDD3)),
      ),
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialBarRoute(builder: (_) => AlertDetailScreen(alert: alert)),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFFECDD3)),
                    ),
                    child: Text(
                      alert.ruleName,
                      style: const TextStyle(color: Color(0xFFDC2626), fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Text(alert.timestamp, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                alert.title,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 4),
              Text(
                'Recommendation: Increase reorder point from ${alert.currentReorder} to ${alert.recommendedReorder} (+${alert.recommendedIncreaseUnits} units)',
                style: const TextStyle(fontSize: 12, color: Color(0xFF0F766E), fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    onPressed: () => provider.ignoreAlert(alert.id),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: const Text('Dismiss', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                  ),
                  const SizedBox(width: 8),
                  FilledButton(
                    onPressed: () => provider.applyRecommendedReorder(alert),
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF0F766E),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: const Text('Apply +20% Surge', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MaterialBarRoute extends MaterialPageRoute {
  MaterialBarRoute({required super.builder});
}
