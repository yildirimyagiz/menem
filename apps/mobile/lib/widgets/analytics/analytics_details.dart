import 'package:flutter/material.dart';
import '../../models/analytics.dart';

class AnalyticsDetails extends StatelessWidget {
  final Analytics analytics;
  const AnalyticsDetails({super.key, required this.analytics});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Analytics', style: Theme.of(context).textTheme.titleLarge),
        // Add analytics fields as needed, e.g.:
        // Text('Metric: ${analytics.metricName}'),
        // Text('Value: ${analytics.value}'),
      ],
    );
  }
}
