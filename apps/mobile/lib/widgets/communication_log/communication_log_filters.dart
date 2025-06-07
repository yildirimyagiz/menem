import 'package:flutter/material.dart';
import '../../models/communication_log.dart';

typedef OnCommunicationLogFilterChanged = void Function(
    {List<CommunicationType>? types}); // Use enum

class CommunicationLogFilters extends StatefulWidget {
  final List<CommunicationType> allTypes; // Use enum
  final OnCommunicationLogFilterChanged onFilterChanged;

  const CommunicationLogFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<CommunicationLogFilters> createState() =>
      _CommunicationLogFiltersState();
}

class _CommunicationLogFiltersState extends State<CommunicationLogFilters> {
  final Set<CommunicationType> _selectedTypes = {}; // Use enum

  void _onTypeTap(CommunicationType type) {
    // Use enum
    setState(() {
      if (!_selectedTypes.add(type)) _selectedTypes.remove(type);
      widget.onFilterChanged(types: _selectedTypes.toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: widget.allTypes
            .map((type) => FilterChip(
                  label: Text(type.name), // Use enum.name for display
                  selected:
                      _selectedTypes.contains(type), // Compare enum values
                  onSelected: (_) => _onTypeTap(type),
                ))
            .toList(),
      ),
    );
  }
}
