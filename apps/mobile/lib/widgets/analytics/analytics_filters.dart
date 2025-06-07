import 'package:flutter/material.dart';
import '../../models/analytics.dart'; // Assuming AnalyticsType enum is here or exported

typedef OnAnalyticsFilterChanged = void Function(
    {List<AnalyticsType>? metrics}); // Use enum

class AnalyticsFilters extends StatefulWidget {
  final List<AnalyticsType> allMetrics; // Use enum
  final OnAnalyticsFilterChanged onFilterChanged;

  const AnalyticsFilters({
    super.key,
    required this.allMetrics,
    required this.onFilterChanged,
  });

  @override
  State<AnalyticsFilters> createState() => _AnalyticsFiltersState();
}

class _AnalyticsFiltersState extends State<AnalyticsFilters> {
  final Set<AnalyticsType> _selectedMetrics = {}; // Use enum

  void _onMetricTap(AnalyticsType metric) {
    // Use enum
    setState(() {
      if (!_selectedMetrics.add(metric)) _selectedMetrics.remove(metric);
      widget.onFilterChanged(metrics: _selectedMetrics.toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: widget.allMetrics
            .map((metric) => FilterChip(
                  // metric is AnalyticsType
                  label: Text(metric.name), // Use enum.name for display
                  selected: _selectedMetrics.contains(metric),
                  onSelected: (_) => _onMetricTap(metric),
                ))
            .toList(),
      ),
    );
  }
}
