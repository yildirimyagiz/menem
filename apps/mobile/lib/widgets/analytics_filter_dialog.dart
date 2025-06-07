import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/analytics.dart';

class AnalyticsFilterDialog extends StatefulWidget {
  final DateTime? startDate;
  final DateTime? endDate;
  final AnalyticsType? selectedType;
  final Function(DateTime?, DateTime?, AnalyticsType?) onFilter;

  const AnalyticsFilterDialog({
    super.key,
    this.startDate,
    this.endDate,
    this.selectedType,
    required this.onFilter,
  });

  @override
  State<AnalyticsFilterDialog> createState() => _AnalyticsFilterDialogState();
}

class _AnalyticsFilterDialogState extends State<AnalyticsFilterDialog> {
  late DateTime? _startDate;
  late DateTime? _endDate;
  late AnalyticsType? _selectedType;

  @override
  void initState() {
    super.initState();
    _startDate = widget.startDate;
    _endDate = widget.endDate;
    _selectedType = widget.selectedType;
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Filter Analytics'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            title: const Text('Start Date'),
            subtitle: Text(
              _startDate != null
                  ? DateFormat('MMM d, y').format(_startDate!)
                  : 'Select start date',
            ),
            trailing: const Icon(Icons.calendar_today),
            onTap: () => _selectDate(true),
          ),
          ListTile(
            title: const Text('End Date'),
            subtitle: Text(
              _endDate != null
                  ? DateFormat('MMM d, y').format(_endDate!)
                  : 'Select end date',
            ),
            trailing: const Icon(Icons.calendar_today),
            onTap: () => _selectDate(false),
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<AnalyticsType>(
            value: _selectedType,
            decoration: const InputDecoration(
              labelText: 'Analytics Type',
              border: OutlineInputBorder(),
            ),
            items: AnalyticsType.values.map((type) {
              return DropdownMenuItem(
                value: type,
                child: Text(type.name), // Using .name for enums
              );
            }).toList(),
            onChanged: (value) {
              setState(() {
                _selectedType = value;
              });
            },
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () {
            setState(() {
              _startDate = null;
              _endDate = null;
              _selectedType = null;
            });
            widget.onFilter(null, null, null);
            Navigator.pop(context);
          },
          child: const Text('Reset'),
        ),
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            widget.onFilter(_startDate, _endDate, _selectedType);
            Navigator.pop(context);
          },
          child: const Text('Apply'),
        ),
      ],
    );
  }

  Future<void> _selectDate(bool isStartDate) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isStartDate
          ? _startDate ?? DateTime.now()
          : _endDate ?? DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() {
        if (isStartDate) {
          _startDate = picked;
          if (_endDate != null && _endDate!.isBefore(_startDate!)) {
            _endDate = _startDate;
          }
        } else {
          _endDate = picked;
          if (_startDate != null && _startDate!.isAfter(_endDate!)) {
            _startDate = _endDate;
          }
        }
      });
    }
  }
}
