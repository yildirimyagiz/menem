import 'package:flutter/material.dart';

typedef OnTaxRecordFilterChanged = void Function({List<String>? years});

class TaxRecordFilters extends StatefulWidget {
  final List<String> allYears;
  final OnTaxRecordFilterChanged onFilterChanged;

  const TaxRecordFilters({
    super.key,
    required this.allYears,
    required this.onFilterChanged,
  });

  @override
  State<TaxRecordFilters> createState() => _TaxRecordFiltersState();
}

class _TaxRecordFiltersState extends State<TaxRecordFilters> {
  final Set<String> _selectedYears = {};

  void _onYearTap(String year) {
    setState(() {
      if (!_selectedYears.add(year)) _selectedYears.remove(year);
      widget.onFilterChanged(years: _selectedYears.toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: widget.allYears
            .map((year) => FilterChip(
                  label: Text(year),
                  selected: _selectedYears.contains(year),
                  onSelected: (_) => _onYearTap(year),
                ))
            .toList(),
      ),
    );
  }
}
