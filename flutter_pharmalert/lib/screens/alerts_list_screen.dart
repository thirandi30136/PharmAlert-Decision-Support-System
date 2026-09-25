import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pharmalert/providers/app_provider.dart';
import 'package:pharmalert/models/alert_item.dart';
import 'package:pharmalert/screens/alert_detail_screen.dart';

class AlertsListScreen extends StatefulWidget {
  const AlertsListScreen({super.key});

  @override
  State<AlertsListScreen> createState() => _AlertsListScreenState();
}

class _AlertsListScreenState extends State<AlertsListScreen> {
  String _filter = 'ALL'; // 'ALL', 'CRITICAL', 'WARNING', 'ACTIONED'

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final allAlerts = provider.alerts;

    final filteredAlerts = allAlerts.where((a) {
      if (_filter == 'ALL') return a.status == 'active';
      if (_filter == 'CRITICAL') return a.status == 'active' && a.severity == 'CRITICAL';
      if (_filter == 'WARNING') return a.status == 'active' && a.severity == 'WARNING';
      if (_filter == 'ACTIONED') return a.status == 'actioned';
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F766E),
        elevation: 1,
        title: const Text(
          'Dengue Alerts & Procurement',
          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          // Filter Chips
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('Active (${provider.activeAlerts.length})', 'ALL'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Critical', 'CRITICAL'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Warning', 'WARNING'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Actioned', 'ACTIONED'),
                ],
              ),
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),

          // List View
          Expanded(
            child: filteredAlerts.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.verified_outlined, size: 56, color: Colors.teal.shade200),
                          const SizedBox(height: 14),
                          const Text(
                            'No alerts matching this filter',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Your pharmacy inventory aligns with current epidemiological surveillance thresholds.',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 14, 16, 90),
                    itemCount: filteredAlerts.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final alert = filteredAlerts[index];
                      return _buildCard(context, alert, provider);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _filter == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _filter = value),
      selectedColor: const Color(0xFF0F766E),
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : const Color(0xFF475569),
        fontSize: 12,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
      ),
      backgroundColor: const Color(0xFFF1F5F9),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide.none),
    );
  }

  Widget _buildCard(BuildContext context, AlertItem alert, AppProvider provider) {
    final isCritical = alert.severity == 'CRITICAL';
    final isActioned = alert.status == 'actioned';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActioned
              ? const Color(0xFFA7F3D0)
              : isCritical
                  ? const Color(0xFFFECDD3)
                  : const Color(0xFFFED7AA),
        ),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 6, offset: const Offset(0, 2)),
        ],
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => AlertDetailScreen(alert: alert)),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isActioned
                          ? const Color(0xFFECFDF5)
                          : isCritical
                              ? const Color(0xFFFEF2F2)
                              : const Color(0xFFFFFBEB),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      isActioned ? 'ACTIONED' : alert.ruleName,
                      style: TextStyle(
                        color: isActioned
                            ? const Color(0xFF059669)
                            : isCritical
                                ? const Color(0xFFDC2626)
                                : const Color(0xFFD97706),
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Text(alert.timestamp, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                alert.title,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 4),
              Text(
                alert.reason,
                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 12),

              // Reorder Comparison Box
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Baseline Reorder', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
                        Text('${alert.currentReorder} units', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      ],
                    ),
                    const Icon(Icons.arrow_forward, size: 14, color: Color(0xFF94A3B8)),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('Recommended Surge', style: TextStyle(color: Color(0xFF0F766E), fontSize: 10, fontWeight: FontWeight.bold)),
                        Text(
                          '${alert.recommendedReorder} units (+${alert.recommendedIncreaseUnits})',
                          style: const TextStyle(color: Color(0xFF0F766E), fontWeight: FontWeight.w900, fontSize: 12),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              if (!isActioned) ...[
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => provider.ignoreAlert(alert.id),
                      child: const Text('Dismiss', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                    ),
                    const SizedBox(width: 8),
                    FilledButton(
                      onPressed: () => provider.applyRecommendedReorder(alert),
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF0F766E),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      ),
                      child: const Text('Apply Recommended Reorder', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
