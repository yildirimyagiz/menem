import 'package:flutter/material.dart';
import '../../models/expense.dart';

class ExpenseFilters extends StatefulWidget {
  final void Function({String? title, ExpenseType? type, ExpenseStatus? status}) onChanged;
  const ExpenseFilters({super.key, required this.onChanged});

  @override
  State<ExpenseFilters> createState() => _ExpenseFiltersState();
}

class _ExpenseFiltersState extends State<ExpenseFilters> {
  final _titleController = TextEditingController();
  ExpenseType? _selectedType;
  ExpenseStatus? _selectedStatus;

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      title: _titleController.text.isEmpty ? null : _titleController.text,
      type: _selectedType,
      status: _selectedStatus,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _titleController,
          decoration: const InputDecoration(labelText: 'Title'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<ExpenseType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: ExpenseType.values
              .map((type) => DropdownMenuItem(
                    value: type,
                    child: Text(type.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (type) {
            setState(() => _selectedType = type);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<ExpenseStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: ExpenseStatus.values
              .map((status) => DropdownMenuItem(
                    value: status,
                    child: Text(status.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (status) {
            setState(() => _selectedStatus = status);
            _onFilterChanged();
          },
        ),
      ],
    );
  }
}
