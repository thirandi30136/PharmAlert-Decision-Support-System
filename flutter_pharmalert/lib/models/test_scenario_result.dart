class TestScenarioResult {
  final String title;
  final String outcome;
  final bool passed;

  const TestScenarioResult({
    required this.title,
    required this.outcome,
    this.passed = true,
  });

  Map<String, dynamic> toMap() => {
        'title': title,
        'outcome': outcome,
        'passed': passed,
      };

  factory TestScenarioResult.fromMap(Map<String, dynamic> map) =>
      TestScenarioResult(
        title: map['title'] ?? '',
        outcome: map['outcome'] ?? '',
        passed: map['passed'] ?? true,
      );
}
