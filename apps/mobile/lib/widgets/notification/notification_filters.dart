import 'package:flutter/material.dart';

typedef OnNotificationFilterChanged = void Function({List<String>? types});

class NotificationFilters extends StatefulWidget {
  final List<String> allTypes;
  final OnNotificationFilterChanged onFilterChanged;

  const NotificationFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<NotificationFilters> createState() => _NotificationFiltersState();
}

class _NotificationFiltersState extends State<NotificationFilters> {
  final Set<String> _selectedTypes = {};

  void _onTypeTap(String type) {
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
                  label: Text(type),
                  selected: _selectedTypes.contains(type),
                  onSelected: (_) => _onTypeTap(type),
                ))
            .toList(),
      ),
    );
  }
}
