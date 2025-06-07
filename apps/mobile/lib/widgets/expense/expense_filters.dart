import 'package:flutter/material.dart';
import '../../models/expense.dart';

typedef OnExpenseFilterChanged = void Function(
    {List<ExpenseType>? types}); // Use enum

class ExpenseFilters extends StatefulWidget {
  final List<ExpenseType> allTypes; // Use enum
  final OnExpenseFilterChanged onFilterChanged;

  const ExpenseFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<ExpenseFilters> createState() => _ExpenseFiltersState();
}

class _ExpenseFiltersState extends State<ExpenseFilters> {
  final Set<ExpenseType> _selectedTypes = {}; // Use enum

  void _onTypeTap(ExpenseType type) {
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
