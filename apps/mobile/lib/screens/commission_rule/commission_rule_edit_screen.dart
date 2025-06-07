import 'package:flutter/material.dart';
import '../../models/commission_rule.dart';
import 'package:intl/intl.dart';
import 'dart:convert'; // Add this line to import the dart:convert library

class CommissionRuleEditScreen extends StatefulWidget {
  final CommissionRule commissionRule;
  const CommissionRuleEditScreen({super.key, required this.commissionRule});

  @override
  State<CommissionRuleEditScreen> createState() =>
      _CommissionRuleEditScreenState();
}

class _CommissionRuleEditScreenState extends State<CommissionRuleEditScreen> {
  late TextEditingController _providerIdController;
  late TextEditingController _commissionController;
  late TextEditingController _minVolumeController;
  late TextEditingController _maxVolumeController;
  late TextEditingController _conditionsController;
  CommissionRuleType? _ruleType;
  DateTime? _startDate;
  DateTime? _endDate;
  Map<String, dynamic>? _conditions;

  @override
  void initState() {
    super.initState();
    final cr = widget.commissionRule;
    _providerIdController = TextEditingController(text: cr.providerId);
    _commissionController =
        TextEditingController(text: cr.commission.toString());
    _minVolumeController =
        TextEditingController(text: cr.minVolume?.toString() ?? '');
    _maxVolumeController =
        TextEditingController(text: cr.maxVolume?.toString() ?? '');
    _conditionsController =
        TextEditingController(text: cr.conditions?.toString() ?? '');
    _ruleType = cr.ruleType;
    _startDate = cr.startDate;
    _endDate = cr.endDate;
  }

  @override
  void dispose() {
    _providerIdController.dispose();
    _commissionController.dispose();
    _minVolumeController.dispose();
    _maxVolumeController.dispose();
    _conditionsController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.commissionRule.copyWith(
      providerId: _providerIdController.text.trim(),
      commission: double.tryParse(_commissionController.text) ?? 0.0,
      minVolume: int.tryParse(_minVolumeController.text),
      minVolumeExplicitNull: _minVolumeController.text.isEmpty,
      maxVolume: int.tryParse(_maxVolumeController.text),
      maxVolumeExplicitNull: _maxVolumeController.text.isEmpty,
      ruleType: _ruleType,
      startDate: _startDate,
      startDateExplicitNull: _startDate == null,
      endDate: _endDate,
      endDateExplicitNull: _endDate == null,
      conditions:
          _conditionsController.text.trim().isNotEmpty ? _conditions : null,
      conditionsExplicitNull: _conditionsController.text.trim().isEmpty,
      // provider: handled elsewhere if editable
    );
    Navigator.of(context).pop(updated);
  }

  void _updateConditions() {
    if (_conditionsController.text.trim().isEmpty) {
      setState(() {
        _conditions = null;
      });
      return;
    }
    try {
      final json = jsonDecode(_conditionsController.text);
      setState(() {
        _conditions = json;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Invalid JSON in Conditions: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Commission Rule'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _save,
            tooltip: 'Save',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _providerIdController,
              decoration: const InputDecoration(labelText: 'Provider ID'),
            ),
            DropdownButtonFormField<CommissionRuleType>(
              value: _ruleType,
              decoration: const InputDecoration(labelText: 'Rule Type'),
              items: CommissionRuleType.values
                  .map((t) => DropdownMenuItem(
                        value: t,
                        child: Text(t.name),
                      ))
                  .toList(),
              onChanged: (val) => setState(() => _ruleType = val),
            ),
            Row(
              children: [
                const Text('Start Date: '),
                Text(_startDate != null
                    ? DateFormat.yMMMd().format(_startDate!)
                    : 'Not set'),
                IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _startDate ?? DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (picked != null) setState(() => _startDate = picked);
                  },
                ),
              ],
            ),
            Row(
              children: [
                const Text('End Date: '),
                Text(_endDate != null
                    ? DateFormat.yMMMd().format(_endDate!)
                    : 'Not set'),
                IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _endDate ?? DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (picked != null) setState(() => _endDate = picked);
                  },
                ),
              ],
            ),
            TextField(
              controller: _commissionController,
              decoration: const InputDecoration(labelText: 'Commission'),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _minVolumeController,
              decoration: const InputDecoration(labelText: 'Min Volume'),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _maxVolumeController,
              decoration: const InputDecoration(labelText: 'Max Volume'),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _conditionsController,
              decoration:
                  const InputDecoration(labelText: 'Conditions (JSON string)'),
              maxLines: 4,
              onChanged: (text) => _updateConditions(),
            ),
          ],
        ),
      ),
    );
  }
}
