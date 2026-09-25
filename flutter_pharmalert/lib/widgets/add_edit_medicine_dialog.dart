import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pharmalert/models/medicine.dart';
import 'package:pharmalert/providers/app_provider.dart';

class AddEditMedicineDialog extends StatefulWidget {
  final Medicine? editingMedicine;

  const AddEditMedicineDialog({super.key, this.editingMedicine});

  @override
  State<AddEditMedicineDialog> createState() => _AddEditMedicineDialogState();
}

class _AddEditMedicineDialogState extends State<AddEditMedicineDialog> {
  late TextEditingController _nameController;
  late TextEditingController _stockController;
  late TextEditingController _reorderController;
  late TextEditingController _priceController;
  late String _category;
  late String _unit;
  late bool _alertsEnabled;

  final List<String> _categories = [
    'Antipyretic',
    'ORS',
    'Antibiotic',
    'Antihistamine',
    'Analgesic',
    'Other'
  ];

  final List<String> _units = ['Tablets', 'Sachets', 'Capsules', 'Bottles'];

  @override
  void initState() {
    super.initState();
    final med = widget.editingMedicine;
    _nameController = TextEditingController(text: med?.name ?? '');
    _stockController = TextEditingController(text: med != null ? '${med.currentStock}' : '100');
    _reorderController = TextEditingController(text: med != null ? '${med.reorderThreshold}' : '150');
    _priceController = TextEditingController(text: med != null ? '${med.priceLKR}' : '10.0');
    _category = med?.category ?? 'Antipyretic';
    _unit = med?.unit ?? 'Tablets';
    _alertsEnabled = med?.alertsEnabled ?? true;
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.editingMedicine != null;
    final provider = context.read<AppProvider>();

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isEditing ? 'Edit Medicine Details' : 'Add New Inventory Item',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 14),

            // Name
            const Text('Medicine Name', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
            const SizedBox(height: 4),
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                hintText: 'e.g. Paracetamol 500mg',
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 12),

            // Category & Unit row
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Category', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                      const SizedBox(height: 4),
                      DropdownButtonFormField<String>(
                        value: _category,
                        items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 12)))).toList(),
                        onChanged: (val) => setState(() => _category = val ?? _category),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Unit of Measure', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                      const SizedBox(height: 4),
                      DropdownButtonFormField<String>(
                        value: _unit,
                        items: _units.map((u) => DropdownMenuItem(value: u, child: Text(u, style: const TextStyle(fontSize: 12)))).toList(),
                        onChanged: (val) => setState(() => _unit = val ?? _unit),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Stock and Reorder row
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Current Balance', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                      const SizedBox(height: 4),
                      TextField(
                        controller: _stockController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Reorder Point', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                      const SizedBox(height: 4),
                      TextField(
                        controller: _reorderController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Price LKR
            const Text('Unit Price (LKR)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
            const SizedBox(height: 4),
            TextField(
              controller: _priceController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 10),

            // Alerts Enabled Switch
            SwitchListTile(
              title: const Text('Epidemiological Alerts Enabled', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              subtitle: const Text('Include in Section 4 rule surge evaluation', style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
              value: _alertsEnabled,
              contentPadding: EdgeInsets.zero,
              activeColor: const Color(0xFF0F766E),
              onChanged: (val) => setState(() => _alertsEnabled = val),
            ),
            const SizedBox(height: 16),

            // Action buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B))),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: () {
                    final name = _nameController.text.trim();
                    if (name.isEmpty) return;

                    final currentStock = int.tryParse(_stockController.text) ?? 0;
                    final reorderThreshold = int.tryParse(_reorderController.text) ?? 100;
                    final priceLKR = double.tryParse(_priceController.text) ?? 10.0;

                    if (isEditing) {
                      final updated = widget.editingMedicine!.copyWith(
                        name: name,
                        category: _category,
                        unit: _unit,
                        currentStock: currentStock,
                        reorderThreshold: reorderThreshold,
                        priceLKR: priceLKR,
                        alertsEnabled: _alertsEnabled,
                        lastUpdated: 'Just now',
                      );
                      provider.updateMedicine(updated);
                    } else {
                      final newMed = Medicine(
                        id: 'med-${DateTime.now().millisecondsSinceEpoch}',
                        name: name,
                        category: _category,
                        unit: _unit,
                        currentStock: currentStock,
                        reorderThreshold: reorderThreshold,
                        priceLKR: priceLKR,
                        alertsEnabled: _alertsEnabled,
                        lastUpdated: 'Just added',
                      );
                      provider.addMedicine(newMed);
                    }
                    Navigator.pop(context);
                  },
                  style: FilledButton.styleFrom(backgroundColor: const Color(0xFF0F766E)),
                  child: Text(isEditing ? 'Save Changes' : 'Add Item'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
