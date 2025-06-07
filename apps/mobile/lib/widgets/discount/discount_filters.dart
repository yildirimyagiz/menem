import 'package:flutter/material.dart';
import '../../models/discount.dart';

typedef OnDiscountFilterChanged = void Function(
    {List<DiscountType>? types}); // Use enum

class DiscountFilters extends StatefulWidget {
  final List<DiscountType> allTypes; // Use enum
  final OnDiscountFilterChanged onFilterChanged;

  const DiscountFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<DiscountFilters> createState() => _DiscountFiltersState();
}

class _DiscountFiltersState extends State<DiscountFilters> {
  final Set<DiscountType> _selectedTypes = {}; // Use enum

  void _onTypeTap(DiscountType type) {
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
