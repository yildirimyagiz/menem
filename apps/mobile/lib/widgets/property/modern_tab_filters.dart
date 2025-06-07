import 'package:flutter/material.dart';
import '../../models/property.dart';

typedef OnFilterChanged = void Function({
  List<PropertyType>? types,
  List<PropertyStatus>? statuses,
  List<PropertyCategory>? categories,
});

class ModernTabFilters extends StatefulWidget {
  final List<PropertyType> allTypes;
  final List<PropertyStatus> allStatuses;
  final List<PropertyCategory> allCategories;
  final OnFilterChanged onFilterChanged;

  const ModernTabFilters({
    super.key,
    required this.allTypes,
    required this.allStatuses,
    required this.allCategories,
    required this.onFilterChanged,
  });

  @override
  State<ModernTabFilters> createState() => _ModernTabFiltersState();
}

class _ModernTabFiltersState extends State<ModernTabFilters> {
  final Set<PropertyType> _selectedTypes = {};
  final Set<PropertyStatus> _selectedStatuses = {};
  final Set<PropertyCategory> _selectedCategories = {};

  void _onTypeTap(PropertyType type) {
    setState(() {
      if (!_selectedTypes.add(type)) _selectedTypes.remove(type);
      widget.onFilterChanged(
        types: _selectedTypes.toList(),
        statuses: _selectedStatuses.toList(),
        categories: _selectedCategories.toList(),
      );
    });
  }

  void _onStatusTap(PropertyStatus status) {
    setState(() {
      if (!_selectedStatuses.add(status)) _selectedStatuses.remove(status);
      widget.onFilterChanged(
        types: _selectedTypes.toList(),
        statuses: _selectedStatuses.toList(),
        categories: _selectedCategories.toList(),
      );
    });
  }

  void _onCategoryTap(PropertyCategory category) {
    setState(() {
      if (!_selectedCategories.add(category)) _selectedCategories.remove(category);
      widget.onFilterChanged(
        types: _selectedTypes.toList(),
        statuses: _selectedStatuses.toList(),
        categories: _selectedCategories.toList(),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          ...widget.allTypes.map((type) => FilterChip(
                label: Text(type.name),
                selected: _selectedTypes.contains(type),
                onSelected: (_) => _onTypeTap(type),
              )),
          ...widget.allStatuses.map((status) => FilterChip(
                label: Text(status.name),
                selected: _selectedStatuses.contains(status),
                onSelected: (_) => _onStatusTap(status),
              )),
          ...widget.allCategories.map((cat) => FilterChip(
                label: Text(cat.name),
                selected: _selectedCategories.contains(cat),
                onSelected: (_) => _onCategoryTap(cat),
              )),
        ],
      ),
    );
  }
}
