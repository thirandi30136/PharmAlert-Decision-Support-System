import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pharmalert/providers/app_provider.dart';

class RuleTestDialog extends StatelessWidget {
  const RuleTestDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.read<AppProvider>();

    final scenarios = [
      {
        'name': 'Scenario 1: Heavy Rain Event Trigger',
        'subtitle': 'Rule R1 Test · Initial surveillance activation',
        'rain': 65.0,
        'search': 42.0,
        'weeks': 0,
        'flag': true,
        'fever': 15.0,
        'expected': 'R1 triggers 10-week monitoring flag. Zero medicine alerts generated yet (correct lag behavior).',
      },
      {
        'name': 'Scenario 2: Mid-Surveillance Lag (Week 5)',
        'subtitle': 'Section 7.1 Test 2 · False-positive prevention',
        'rain': 22.0,
        'search': 18.0,
        'weeks': 5,
        'flag': true,
        'fever': 10.0,
        'expected': 'Flag remains active. 5/10 weeks elapsed. No false alerts triggered before peak.',
      },
      {
        'name': 'Scenario 3: 10-Week Epidemic Peak (Outbreak)',
        'subtitle': 'Section 7.1 Test 3 · Full procurement surge trigger',
        'rain': 45.0,
        'search': 38.0,
        'weeks': 10,
        'flag': true,
        'fever': 25.0,
        'expected': 'Rules R2 & R3 trigger! Critical Paracetamol +20% buffer & ORS +30% surge.',
      },
      {
        'name': 'Scenario 4: Baseline Dry Season',
        'subtitle': 'Section 7.1 Test 4 · Normal baseline conditions',
        'rain': 12.0,
        'search': 5.0,
        'weeks': 0,
        'flag': false,
        'fever': 5.0,
        'expected': 'All clear. Zero alert thresholds reached. Standard reorder points maintained.',
      },
      {
        'name': 'Scenario 5: Viral Allergy/Fever Surge',
        'subtitle': 'Rule R4 Test · Fever search & rain confluence',
        'rain': 38.0,
        'search': 20.0,
        'weeks': 2,
        'flag': false,
        'fever': 38.0,
        'expected': 'Rule R4 triggers! Cetirizine reorder point increased +15% for symptomatic surge.',
      },
    ];

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 480),
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.auto_awesome, color: Color(0xFF0F766E), size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Section 7.1 Test Scenarios',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              const Text(
                'Run predefined epidemiological scenarios to verify rule mathematical correctness against Erandi et al. (2021) benchmarks.',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 14),

              ...scenarios.map((sc) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              sc['name'] as String,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                            ),
                          ),
                          FilledButton(
                            onPressed: () {
                              provider.runScenario(
                                name: sc['name'] as String,
                                rainfallMm: (sc['rain'] as num).toDouble(),
                                searchSpikePercent: (sc['search'] as num).toDouble(),
                                weeksElapsed: sc['weeks'] as int,
                                flagActive: sc['flag'] as bool,
                                feverSearchPercent: (sc['fever'] as num).toDouble(),
                              );
                              Navigator.pop(context);
                            },
                            style: FilledButton.styleFrom(
                              backgroundColor: const Color(0xFF0F766E),
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              minimumSize: const Size(60, 30),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            child: const Text('Run Test', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(sc['subtitle'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF0F766E), fontWeight: FontWeight.w600)),
                      const SizedBox(height: 6),
                      Text(
                        'Expected: ${sc['expected']}',
                        style: const TextStyle(fontSize: 11, color: Color(0xFF475569)),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
