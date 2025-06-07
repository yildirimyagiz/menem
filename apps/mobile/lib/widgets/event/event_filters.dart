import 'package:flutter/material.dart';
import '../../models/event.dart';

typedef OnEventFilterChanged = void Function(
    {List<EventType>? types}); // Use enum

class EventFilters extends StatefulWidget {
  final List<EventType> allTypes; // Use enum
  final OnEventFilterChanged onFilterChanged;

  const EventFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<EventFilters> createState() => _EventFiltersState();
}

class _EventFiltersState extends State<EventFilters> {
  final Set<EventType> _selectedTypes = {}; // Use enum

  void _onTypeTap(EventType type) {
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
