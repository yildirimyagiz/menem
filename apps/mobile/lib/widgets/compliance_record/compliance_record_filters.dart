import 'package:flutter/material.dart';
import '../../models/compliance_record.dart';

typedef OnComplianceRecordFilterChanged = void Function({List<ComplianceType>? types});

class ComplianceRecordFilters extends StatefulWidget {
  final List<ComplianceType> allTypes;
  final OnComplianceRecordFilterChanged onFilterChanged;

  const ComplianceRecordFilters({
    super.key,
    required this.allTypes,
    required this.onFilterChanged,
  });

  @override
  State<ComplianceRecordFilters> createState() =>
      _ComplianceRecordFiltersState();
}

class _ComplianceRecordFiltersState extends State<ComplianceRecordFilters> {
  final Set<ComplianceType> _selectedTypes = {};

  void _onTypeTap(ComplianceType type) {
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
                  label: Text(_typeLabel(type)),
                  selected: _selectedTypes.contains(type),
                  onSelected: (_) => _onTypeTap(type),
                ))
            .toList(),
      ),
    );
  }

  String _typeLabel(ComplianceType type) {
    switch (type) {
      case ComplianceType.license:
        return 'License';
      case ComplianceType.certification:
        return 'Certification';
      case ComplianceType.insurance:
        return 'Insurance';
      case ComplianceType.permit:
        return 'Permit';
      case ComplianceType.other:
        return 'Other';
    }
  }
}
