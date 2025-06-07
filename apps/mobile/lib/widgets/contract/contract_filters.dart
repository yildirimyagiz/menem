import 'package:flutter/material.dart';
import '../../models/contract.dart';

typedef OnContractFilterChanged = void Function(
    {List<ContractType>? types}); // Use enum

class ContractFilters extends StatefulWidget {
  final List<ContractType> allTypes; // Use enum
  final OnContractFilterChanged onFilterChanged;

  const ContractFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<ContractFilters> createState() => _ContractFiltersState();
}

class _ContractFiltersState extends State<ContractFilters> {
  final Set<ContractType> _selectedTypes = {}; // Use enum

  void _onTypeTap(ContractType type) {
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
