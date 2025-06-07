import 'package:flutter/material.dart';
import '../../models/favorite.dart';

typedef OnFavoriteFilterChanged = void Function(
    {List<FavoriteType>? types}); // Use enum

class FavoriteFilters extends StatefulWidget {
  final List<FavoriteType> allTypes; // Use enum
  final OnFavoriteFilterChanged onFilterChanged;

  const FavoriteFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<FavoriteFilters> createState() => _FavoriteFiltersState();
}

class _FavoriteFiltersState extends State<FavoriteFilters> {
  final Set<FavoriteType> _selectedTypes = {}; // Use enum

  void _onTypeTap(FavoriteType type) {
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
