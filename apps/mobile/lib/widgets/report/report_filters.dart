import 'package:flutter/material.dart';

typedef OnReportFilterChanged = void Function({List<String>? statuses});

class ReportFilters extends StatefulWidget {
  final List<String> allStatuses;
  final OnReportFilterChanged onFilterChanged;

  const ReportFilters({
    super.key,
    required this.allStatuses,
    required this.onFilterChanged,
  });

  @override
  State<ReportFilters> createState() => _ReportFiltersState();
}

class _ReportFiltersState extends State<ReportFilters> {
  final Set<String> _selectedStatuses = {};

  void _onStatusTap(String status) {
    setState(() {
      if (!_selectedStatuses.add(status)) _selectedStatuses.remove(status);
      widget.onFilterChanged(statuses: _selectedStatuses.toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: widget.allStatuses
            .map((status) => FilterChip(
                  label: Text(status),
                  selected: _selectedStatuses.contains(status),
                  onSelected: (_) => _onStatusTap(status),
                ))
            .toList(),
      ),
    );
  }
}
