import 'package:flutter/material.dart';
enum SimpleAvailabilityStatus { available, blocked, booked }

typedef OnAvailabilityFilterChanged = void Function({List<SimpleAvailabilityStatus>? statuses});

class AvailabilityFilters extends StatefulWidget {
  final List<SimpleAvailabilityStatus> allStatuses;
  final OnAvailabilityFilterChanged onFilterChanged;

  const AvailabilityFilters({
    super.key,
    required this.allStatuses,
    required this.onFilterChanged,
  });

  @override
  State<AvailabilityFilters> createState() => _AvailabilityFiltersState();
}

class _AvailabilityFiltersState extends State<AvailabilityFilters> {
  final Set<SimpleAvailabilityStatus> _selectedStatuses = {};

  void _onStatusTap(SimpleAvailabilityStatus status) {
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
                  label: Text(_statusLabel(status)),
                  selected: _selectedStatuses.contains(status),
                  onSelected: (_) => _onStatusTap(status),
                ))
            .toList(),
      ),
    );
  }

  String _statusLabel(SimpleAvailabilityStatus status) {
    switch (status) {
      case SimpleAvailabilityStatus.available:
        return 'Available';
      case SimpleAvailabilityStatus.blocked:
        return 'Blocked';
      case SimpleAvailabilityStatus.booked:
        return 'Booked';
    }
  }
}
