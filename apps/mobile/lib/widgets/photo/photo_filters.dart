import 'package:flutter/material.dart';

typedef OnPhotoFilterChanged = void Function({List<String>? types});

class PhotoFilters extends StatefulWidget {
  final List<String> allTypes;
  final OnPhotoFilterChanged onFilterChanged;

  const PhotoFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<PhotoFilters> createState() => _PhotoFiltersState();
}

class _PhotoFiltersState extends State<PhotoFilters> {
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
