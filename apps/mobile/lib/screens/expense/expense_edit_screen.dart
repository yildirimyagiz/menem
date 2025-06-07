import 'package:flutter/material.dart';
import '../../models/expense.dart';
import 'package:intl/intl.dart';

class ExpenseEditScreen extends StatefulWidget {
  final Expense expense;
  const ExpenseEditScreen({super.key, required this.expense});

  @override
  State<ExpenseEditScreen> createState() => _ExpenseEditScreenState();
}

class _ExpenseEditScreenState extends State<ExpenseEditScreen> {
  late TextEditingController _amountController;
  late TextEditingController _currencyIdController;
  late TextEditingController _notesController;
  late ExpenseType _type; // Changed from String
  ExpenseStatus? _status; // Changed from String?
  DateTime? _dueDate;
  DateTime? _paidDate;

  @override
  void initState() {
    super.initState();
    final e = widget.expense;
    _amountController = TextEditingController(text: e.amount.toString());
    _currencyIdController = TextEditingController(text: e.currency);
    _notesController = TextEditingController(text: e.notes ?? '');
    _type = e.type; // Assumes e.type is ExpenseType
    _status = e.status; // Assumes e.status is ExpenseStatus?
    _dueDate = e.dueDate;
    _paidDate = e.paidDate;
  }

  @override
  void dispose() {
    _amountController.dispose();
    _currencyIdController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.expense.copyWith(
      amount: double.tryParse(_amountController.text.trim()),
      currencyId: _currencyIdController.text.trim(),
      notes: _notesController.text.trim().isNotEmpty
          ? _notesController.text.trim()
          : null,
      type: _type.toString().split('.').last,
      status: _status?.toString().split('.').last,
      dueDate: _dueDate,
      paidDate: _paidDate,
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
        title: const Text('Edit Expense'),
        actions: [IconButton(icon: const Icon(Icons.save), onPressed: _save)],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
                controller: _amountController,
                decoration: const InputDecoration(labelText: 'Amount'),
                keyboardType: TextInputType.number),
            TextField(
                controller: _currencyIdController,
                decoration: const InputDecoration(labelText: 'Currency ID')),
            DropdownButtonFormField<ExpenseType>(
              value: _type,
              decoration: const InputDecoration(labelText: 'Type'),
              items: ExpenseType.values
                  .map((t) => DropdownMenuItem(
                        value: t,
                        child: Text(t.toString().split('.').last),
                      ))
                  .toList(),
              onChanged: (v) =>
                  setState(() => _type = v!), // v will be ExpenseType
            ),
            DropdownButtonFormField<ExpenseStatus>(
              value: _status,
              decoration: const InputDecoration(labelText: 'Status'),
              items: ExpenseStatus.values
                  .map((s) => DropdownMenuItem(
                        value: s,
                        child: Text(s.toString().split('.').last),
                      ))
                  .toList(),
              onChanged: (v) =>
                  setState(() => _status = v), // v will be ExpenseStatus?
            ),
            Row(
              children: [
                Expanded(
                    child: Text(_dueDate != null
                        ? 'Due: ${DateFormat.yMd().format(_dueDate!)}'
                        : 'Due Date')),
                IconButton(
                    icon: const Icon(Icons.date_range),
                    onPressed: () => _pickDate(context, _dueDate,
                        (d) => setState(() => _dueDate = d))),
              ],
            ),
            Row(
              children: [
                Expanded(
                    child: Text(_paidDate != null
                        ? 'Paid: ${DateFormat.yMd().format(_paidDate!)}'
                        : 'Paid Date')),
                IconButton(
                    icon: const Icon(Icons.date_range),
                    onPressed: () => _pickDate(context, _paidDate,
                        (d) => setState(() => _paidDate = d))),
              ],
            ),
            TextField(
                controller: _notesController,
                decoration: const InputDecoration(labelText: 'Notes')),
          ],
        ),
      ),
    );
  }
}
