import 'package:flutter/material.dart';
import '../../models/discount.dart';
import 'package:intl/intl.dart';

class DiscountEditScreen extends StatefulWidget {
  final Discount discount;
  const DiscountEditScreen({super.key, required this.discount});

  @override
  State<DiscountEditScreen> createState() => _DiscountEditScreenState();
}

class _DiscountEditScreenState extends State<DiscountEditScreen> {
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;
  late TextEditingController _codeController;
  late TextEditingController _valueController;
  DiscountType? _type;
  DateTime? _startDate;
  DateTime? _endDate;
  late TextEditingController _maxUsageController;
  late bool _isActive;

  @override
  void initState() {
    super.initState();
    final d = widget.discount;
    _nameController = TextEditingController(text: d.name ?? '');
    _descriptionController = TextEditingController(text: d.description);
    _codeController = TextEditingController(text: d.code);
    _valueController = TextEditingController(
        text: d.value.toString()); // d.value is non-nullable
    _type = d.type; // Assuming d.type is DiscountType?
    _startDate = d.startDate;
    _endDate = d.endDate;
    _maxUsageController =
        TextEditingController(text: d.maxUses?.toString() ?? '');
    _isActive = d.status == DiscountStatus.active;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _codeController.dispose();
    _valueController.dispose();
    _maxUsageController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.discount.copyWith(
      name: _nameController.text.trim(),
      description: _descriptionController.text.trim().isNotEmpty
          ? _descriptionController.text.trim()
          : null,
      code: _codeController.text.trim().isNotEmpty
          ? _codeController.text.trim()
          : null,
      value: double.tryParse(_valueController.text.trim()),
      type: _type,
      startDate: _startDate,
      endDate: _endDate,
      maxUses: int.tryParse(_maxUsageController.text.trim()),
      isActive: _isActive,
      // pricingRuleId: _pricingRuleId, // _pricingRuleId is not defined in state
      // propertyId: _propertyId,     // _propertyId is not defined in state
    );
    Navigator.of(context).pop(updated);
  }

  Future<void> _pickDate(BuildContext context, DateTime? initial,
      ValueChanged<DateTime?> onPicked) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: initial ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) onPicked(picked);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Discount'),
        actions: [IconButton(icon: const Icon(Icons.save), onPressed: _save)],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Name')),
            TextField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description')),
            TextField(
                controller: _codeController,
                decoration: const InputDecoration(labelText: 'Code')),
            TextField(
                controller: _valueController,
                decoration: const InputDecoration(labelText: 'Value'),
                keyboardType: TextInputType.number),
            DropdownButtonFormField<DiscountType>(
              value: _type,
              decoration: const InputDecoration(labelText: 'Type'),
              items: DiscountType.values
                  .map((t) => DropdownMenuItem(
                        value: t,
                        child: Text(t.toString().split('.').last),
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _type = v),
            ),
            Row(
              children: [
                Expanded(
                    child: Text(_startDate != null
                        ? 'Start: ${DateFormat.yMd().format(_startDate!)}'
                        : 'Start Date')),
                IconButton(
                    icon: const Icon(Icons.date_range),
                    onPressed: () => _pickDate(context, _startDate,
                        (d) => setState(() => _startDate = d))),
              ],
            ),
            Row(
              children: [
                Expanded(
                    child: Text(_endDate != null
                        ? 'End: ${DateFormat.yMd().format(_endDate!)}'
                        : 'End Date')),
                IconButton(
                    icon: const Icon(Icons.date_range),
                    onPressed: () => _pickDate(context, _endDate,
                        (d) => setState(() => _endDate = d))),
              ],
            ),
            TextField(
                controller: _maxUsageController,
                decoration: const InputDecoration(labelText: 'Max Usage'),
                keyboardType: TextInputType.number),
            SwitchListTile(
                title: const Text('Active'),
                value: _isActive,
                onChanged: (v) => setState(() => _isActive = v)),
          ],
        ),
      ),
    );
  }
}
