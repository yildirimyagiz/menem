import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AvailabilityFilterDialog extends StatefulWidget {
  final DateTime? startDate;
  final DateTime? endDate;
  final Function(DateTime?, DateTime?) onFilter;

  const AvailabilityFilterDialog({
    super.key,
    this.startDate,
    this.endDate,
    required this.onFilter,
  });

  @override
  State<AvailabilityFilterDialog> createState() =>
      _AvailabilityFilterDialogState();
}

class _AvailabilityFilterDialogState extends State<AvailabilityFilterDialog> {
  late DateTime? _startDate;
  late DateTime? _endDate;

  @override
  void initState() {
    super.initState();
    _startDate = widget.startDate;
    _endDate = widget.endDate;
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Filter Availability'),
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
        ],
      ),
      actions: [
        TextButton(
          onPressed: () {
            setState(() {
              _startDate = null;
              _endDate = null;
            });
            widget.onFilter(null, null);
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
            widget.onFilter(_startDate, _endDate);
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
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
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
