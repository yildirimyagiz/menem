import 'package:flutter/material.dart';
import '../../models/channel.dart'; // Assuming ChannelStatus enum is here or exported

typedef OnChannelFilterChanged = void Function(
    {List<ChannelStatus>? statuses}); // Use enum

class ChannelFilters extends StatefulWidget {
  final List<ChannelStatus> allStatuses; // Use enum
  final OnChannelFilterChanged onFilterChanged;

  const ChannelFilters({
    super.key,
    required this.allStatuses,
    required this.onFilterChanged,
  });

  @override
  State<ChannelFilters> createState() => _ChannelFiltersState();
}

class _ChannelFiltersState extends State<ChannelFilters> {
  final Set<ChannelStatus> _selectedStatuses = {}; // Use enum

  void _onStatusTap(ChannelStatus status) {
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
                  // status is ChannelStatus
                  label: Text(status.name), // Use enum.name for display
                  selected: _selectedStatuses.contains(status),
                  onSelected: (_) => _onStatusTap(status),
                ))
            .toList(),
      ),
    );
  }
}
