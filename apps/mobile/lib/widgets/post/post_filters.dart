import 'package:flutter/material.dart';

typedef OnPostFilterChanged = void Function({List<String>? types});

class PostFilters extends StatefulWidget {
  final List<String> allTypes;
  final OnPostFilterChanged onFilterChanged;

  const PostFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<PostFilters> createState() => _PostFiltersState();
}

class _PostFiltersState extends State<PostFilters> {
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
