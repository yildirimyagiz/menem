import 'package:flutter/material.dart';
import '../../models/analytics.dart';
import 'package:intl/intl.dart';

class AnalyticsCard extends StatelessWidget {
  final Analytics analytics;
  final VoidCallback? onTap;
  const AnalyticsCard({super.key, required this.analytics, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.analytics),
        title: Text(analytics.type.toString().split('.').last),
        subtitle: Text('Entity: ${analytics.entityId}'),
        trailing: Text(DateFormat.yMMMd().format(analytics.timestamp)),
      ),
    );
  }
}
