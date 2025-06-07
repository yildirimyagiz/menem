import 'package:flutter/material.dart';
import '../../models/ticket.dart';

typedef OnTicketFilterChanged = void Function({List<TicketStatus>? statuses});

class TicketFilters extends StatefulWidget {
  final List<TicketStatus> allStatuses;
  final OnTicketFilterChanged onFilterChanged;

  const TicketFilters({
    super.key,
    required this.allStatuses,
    required this.onFilterChanged,
  });

  @override
  State<TicketFilters> createState() => _TicketFiltersState();
}

class _TicketFiltersState extends State<TicketFilters> {
  final Set<TicketStatus> _selectedStatuses = {};

  void _onStatusTap(TicketStatus status) {
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
        children: widget.allStatuses.map((status) => FilterChip(
          label: Text(status.name),
          selected: _selectedStatuses.contains(status),
          onSelected: (_) => _onStatusTap(status),
        )).toList(),
      ),
    );
  }
}
