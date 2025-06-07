import 'package:flutter/material.dart';
import '../../models/guest.dart';

typedef OnGuestFilterChanged = void Function({List<GuestStatus>? statuses});

class GuestFilters extends StatefulWidget {
  final List<GuestStatus> allStatuses;
  final OnGuestFilterChanged onFilterChanged;

  const GuestFilters({
    super.key,
    required this.allStatuses,
    required this.onFilterChanged,
  });

  @override
  State<GuestFilters> createState() => _GuestFiltersState();
}

class _GuestFiltersState extends State<GuestFilters> {
  final Set<GuestStatus> _selectedStatuses = {};

  void _onStatusTap(GuestStatus status) {
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

  String _statusLabel(GuestStatus status) {
    switch (status) {
      case GuestStatus.pending:
        return 'Pending';
      case GuestStatus.active:
        return 'Active';
      case GuestStatus.inactive:
        return 'Inactive';
      case GuestStatus.blocked:
        return 'Blocked';
    }
  }
}
