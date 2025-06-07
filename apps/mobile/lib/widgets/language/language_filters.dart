import 'package:flutter/material.dart';
// Assuming Language model is here or exported

typedef OnLanguageFilterChanged = void Function(
    {bool? isActive}); // Correct typedef

class LanguageFilters extends StatefulWidget {
  // No need for allStatuses if filtering by isActive boolean
  final OnLanguageFilterChanged onFilterChanged;

  // Removed the 'allStatuses' parameter as it's not used for boolean filtering
  const LanguageFilters({
    super.key,
    required this.onFilterChanged,
    // The 'allStatuses' parameter is no longer needed and should be removed.
  });
  // If you need to pass initial filter state, you might add parameters here
  // e.g., final bool? initialIsActive;

  @override
  State<LanguageFilters> createState() => _LanguageFiltersState();
}

class _LanguageFiltersState extends State<LanguageFilters> {
  bool? _selectedIsActive; // State can be null (no filter), true, or false

  void _onActiveTap(bool? isActiveState) {
    setState(() {
      _selectedIsActive = isActiveState;
      widget.onFilterChanged(
          isActive: _selectedIsActive); // Call with 'isActive'
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection:
          Axis.horizontal, // Keep if you might add more filters later
      child: Row(children: [
        // Filter for Active languages
        FilterChip(
          label: const Text('Active'),
          selected: _selectedIsActive == true,
          onSelected: (selected) => _onActiveTap(
              selected ? true : null), // Toggle between true and null
        ),
        const SizedBox(width: 8),
        // Filter for Inactive languages
        FilterChip(
          label: const Text('Inactive'),
          selected: _selectedIsActive == false,
          onSelected: (selected) => _onActiveTap(
              selected ? false : null), // Toggle between false and null
        ),
        // You could add a "All" chip if needed, which would call _onActiveTap(null)
      ]),
    );
  }
  // Removed the local LanguageStatus enum and _statusLabel helper
}
