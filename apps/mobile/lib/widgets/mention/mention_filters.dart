import 'package:flutter/material.dart';
import '../../models/mention.dart';

typedef OnMentionFilterChanged = void Function(
    {List<MentionType>? types}); // Use enum

class MentionFilters extends StatefulWidget {
  final List<MentionType> allTypes; // Use enum
  final OnMentionFilterChanged onFilterChanged;

  const MentionFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<MentionFilters> createState() => _MentionFiltersState();
}

class _MentionFiltersState extends State<MentionFilters> {
  final Set<MentionType> _selectedTypes = {}; // Use enum

  void _onTypeTap(MentionType type) {
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
