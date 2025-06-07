import 'package:flutter/material.dart';

typedef OnIncludedServiceFilterChanged = void Function({List<String>? names});

class IncludedServiceFilters extends StatefulWidget {
  final List<String> allNames;
  final OnIncludedServiceFilterChanged onFilterChanged;

  const IncludedServiceFilters({
    super.key,
    required this.allNames,
    required this.onFilterChanged,
  });

  @override
  State<IncludedServiceFilters> createState() => _IncludedServiceFiltersState();
}

class _IncludedServiceFiltersState extends State<IncludedServiceFilters> {
  final Set<String> _selectedNames = {};

  void _onNameTap(String name) {
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
                  label: Text(name),
                  selected: _selectedNames.contains(name),
                  onSelected: (_) => _onNameTap(name),
                ))
            .toList(),
      ),
    );
  }
}
