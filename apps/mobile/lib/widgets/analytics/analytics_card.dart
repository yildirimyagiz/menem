import 'package:flutter/material.dart';
import '../../models/analytics.dart';
import 'analytics_details.dart';

class AnalyticsCard extends StatelessWidget {
  final Analytics analytics;
  final VoidCallback? onTap;

  const AnalyticsCard({super.key, required this.analytics, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: AnalyticsDetails(analytics: analytics),
        ),
      ),
    );
  }
}
