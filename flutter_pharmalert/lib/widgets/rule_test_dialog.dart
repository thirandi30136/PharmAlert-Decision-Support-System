import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pharmalert/providers/app_provider.dart';
import 'package:pharmalert/models/test_scenario_result.dart';

class RuleTestDialog extends StatefulWidget {
  const RuleTestDialog({super.key});

  @override
  State<RuleTestDialog> createState() => _RuleTestDialogState();
}

class _RuleTestDialogState extends State<RuleTestDialog> {
  TestScenarioResult? _activeTestResult;

  final List<Map<String, dynamic>> _scenarios = const [
    {
      'id': 1,
      'title': 'Scenario 1: Heavy Rain + Rising Search Trend',
      'spec':
          'Heavy rainfall (>50mm over 7 days) + rising search trend → monitoring flag should start; no alert yet (within 10-week lag).',
      'tag': 'Monitoring Lag Check',
      'condition': '7-day rainfall > 50mm AND trend > 30%',
      'values': 'Rainfall 65mm over 7 days | Trend +42%',
      'expected': '10-week monitoring starts (Started), 0 alerts at week 2',
    },
    {
      'id': 2,
      'title': 'Scenario 2: 10 Weeks Post-Rainfall (Stock Below Reorder)',
      'spec':
          '10 weeks after a monitoring flag, with stock below reorder level → alert should be generated (+20% Paracetamol, +30% ORS).',
      'tag': 'Alert Surge Generation',
      'condition': '10 weeks post-flag AND stock < reorder level',
      'values': 'Week 10 | Stock: Paracetamol (450 < 500), ORS (320 < 400) | Rain 60mm/7d',
      'expected': 'Alerts generated (+20% Paracetamol, +30% ORS recommended)',
    },
    {
      'id': 3,
      'title': 'Scenario 3: Stock Already Above Reorder Level',
      'spec':
          'Same scenario (week 10 post-flag) but stock is already above reorder level → no alert should be generated.',
      'tag': 'False-Positive Prevention',
      'condition': 'Week 10 post-flag AND stock >= reorder level',
      'values': 'Paracetamol 900 > 500, ORS 900 > 400',
      'expected': 'No false alert triggered (0 alerts generated)',
    },
    {
      'id': 4,
      'title': 'Scenario 4: Approving an Alert Action',
      'spec':
          'Approving an alert → inventory quantity/threshold updates and the alert status changes to "actioned".',
      'tag': 'Inventory Update Action',
      'condition': 'User approves active outbreak alert recommendation',
      'values': 'Apply surge reorder to inventory threshold',
      'expected': 'Inventory threshold updated & alert marked "actioned"',
    },
    {
      'id': 5,
      'title': 'Scenario 5: No Network / API Failure Offline Resilience',
      'spec':
          'No network / API failure → app should show cached data and a clear \'couldn\'t refresh\' message, not crash.',
      'tag': 'Offline Resilience',
      'condition': 'Open-Meteo REST service connection fails or offline',
      'values': 'Network request timed out / disconnected',
      'expected': 'Cached data displayed gracefully with error notification',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();

    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      clipBehavior: Clip.antiAlias,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 520, maxHeight: 720),
        color: Colors.white,
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              color: const Color(0xFF0F766E),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.shield_outlined,
                      color: Color(0xFF99F6E4),
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Section 7.1 Test Scenario Runner',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Academic verification suite for developer handoff',
                          style: TextStyle(
                            fontSize: 11,
                            color: Color(0xFFCCFBF1),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(18),
                children: [
                  // Verification Result Banner if active
                  if (_activeTestResult != null) ...[
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFA7F3D0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.check_circle_rounded,
                                color: Color(0xFF16A34A),
                                size: 18,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _activeTestResult!.title,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                    color: Color(0xFF16A34A),
                                  ),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF16A34A),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Text(
                                  'PASSED',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _activeTestResult!.outcome,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF334155),
                              height: 1.4,
                            ),
                          ),
                          const SizedBox(height: 10),
                          const Divider(color: Color(0xFFA7F3D0), height: 1),
                          const SizedBox(height: 8),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton.icon(
                              onPressed: () {
                                provider.setTabIndex(0); // Switch to Dashboard
                                Navigator.pop(context);
                              },
                              icon: const Icon(
                                Icons.arrow_forward_rounded,
                                size: 14,
                                color: Color(0xFF0F766E),
                              ),
                              label: const Text(
                                'View on Dashboard →',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF0F766E),
                                ),
                              ),
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Scenarios list
                  ..._scenarios.map((sc) {
                    final int scenarioId = sc['id'] as int;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Text(
                                  sc['title'] as String,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF0FDFA),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: const Color(0xFFCCFBF1)),
                                ),
                                child: Text(
                                  sc['tag'] as String,
                                  style: const TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF0F766E),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            sc['spec'] as String,
                            style: const TextStyle(
                              fontSize: 11,
                              color: Color(0xFF64748B),
                              height: 1.35,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFFF1F5F9)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Text(
                                      'Condition: ',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF475569),
                                      ),
                                    ),
                                    Expanded(
                                      child: Text(
                                        sc['condition'] as String,
                                        style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Row(
                                  children: [
                                    const Text(
                                      'Values: ',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF475569),
                                      ),
                                    ),
                                    Expanded(
                                      child: Text(
                                        sc['values'] as String,
                                        style: const TextStyle(fontSize: 10, color: Color(0xFF0F766E), fontWeight: FontWeight.w500),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),
                          Align(
                            alignment: Alignment.centerRight,
                            child: FilledButton.icon(
                              onPressed: () {
                                final res = provider.runTestScenario(scenarioId);
                                setState(() {
                                  _activeTestResult = res;
                                });
                              },
                              icon: const Icon(Icons.play_arrow_rounded, size: 16),
                              label: Text('Run Scenario $scenarioId'),
                              style: FilledButton.styleFrom(
                                backgroundColor: const Color(0xFF0F766E),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                textStyle: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                elevation: 0,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),

            // Footer
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: Color(0xFFF8FAFC),
                border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton.icon(
                    onPressed: () {
                      provider.resetToDefault();
                      setState(() {
                        _activeTestResult = null;
                      });
                    },
                    icon: const Icon(Icons.refresh, size: 14, color: Color(0xFF64748B)),
                    label: const Text(
                      'Reset to Benchmark',
                      style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text(
                      'Close Runner',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF475569),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
