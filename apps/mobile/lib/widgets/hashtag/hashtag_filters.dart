import 'package:flutter/material.dart';
import '../../models/hashtag.dart';

typedef OnHashtagFilterChanged = void Function(
    {List<HashtagType>? names}); // Use enum

class HashtagFilters extends StatefulWidget {
  final List<HashtagType> allNames; // Use enum
  final OnHashtagFilterChanged onFilterChanged;

  const HashtagFilters({
    super.key,
    required this.allNames,
    required this.onFilterChanged,
  });

  @override
  State<HashtagFilters> createState() => _HashtagFiltersState();
}

class _HashtagFiltersState extends State<HashtagFilters> {
  final Set<HashtagType> _selectedNames = {}; // Use enum

  void _onNameTap(HashtagType name) {
    // Use enum
    setState(() {
      if (!_selectedNames.add(name)) _selectedNames.remove(name);
      widget.onFilterChanged(names: _selectedNames.toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: widget.allNames
            .map((name) => FilterChip(
                  label: Text(name.name), // Use enum.name for display
                  selected:
                      _selectedNames.contains(name), // Compare enum values
                  onSelected: (_) => _onNameTap(name),
                ))
            .toList(),
      ),
    );
  }
}
