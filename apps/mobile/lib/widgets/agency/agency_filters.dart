import 'package:flutter/material.dart';
import '../../models/agency.dart';

typedef OnAgencyFilterChanged = void Function(
    {List<AgencyStatus>? statuses}); // Use enum

class AgencyFilters extends StatefulWidget {
  final List<AgencyStatus> allStatuses; // Use enum
  final OnAgencyFilterChanged onFilterChanged;

  const AgencyFilters({
    super.key,
    required this.allStatuses,
    required this.onFilterChanged,
  });

  @override
  State<AgencyFilters> createState() => _AgencyFiltersState();
}

class _AgencyFiltersState extends State<AgencyFilters> {
  final Set<AgencyStatus> _selectedStatuses = {}; // Use enum

  void _onStatusTap(AgencyStatus status) {
    // Use enum
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
                  label: Text(status.name), // Use enum.name
                  selected: _selectedStatuses.contains(status),
                  onSelected: (_) => _onStatusTap(status),
                ))
            .toList(),
      ),
    );
  }
}
