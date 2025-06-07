import 'package:flutter/material.dart';
import '../../models/facility.dart';

typedef OnFacilityFilterChanged = void Function(
    {List<FacilityType>? types}); // Use enum

class FacilityFilters extends StatefulWidget {
  final List<FacilityType> allTypes; // Use enum
  final OnFacilityFilterChanged onFilterChanged;

  const FacilityFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<FacilityFilters> createState() => _FacilityFiltersState();
}

class _FacilityFiltersState extends State<FacilityFilters> {
  final Set<FacilityType> _selectedTypes = {}; // Use enum

  void _onTypeTap(FacilityType type) {
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
