import 'package:flutter/material.dart';
import '../../models/extra_charge.dart';

class ExtraChargeDetailScreen extends StatelessWidget {
  final ExtraCharge extraCharge;
  const ExtraChargeDetailScreen({super.key, required this.extraCharge});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(extraCharge.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Description', style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 8),
                    Text(extraCharge.description ?? '-'),
                    const SizedBox(height: 16),
                    Text('Facility', style: Theme.of(context).textTheme.titleMedium),
                    Text(extraCharge.facilityId ?? '-'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Relations', style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 8),
                    _buildRelationRow('Properties', extraCharge.propertyIds),
                    _buildRelationRow('Agencies', extraCharge.agencyIds),
                    _buildRelationRow('Users', extraCharge.userIds),
                    _buildRelationRow('Tasks', extraCharge.taskIds),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRelationRow(String label, List<String> ids) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Text('$label: ', style: const TextStyle(fontWeight: FontWeight.bold)),
          Flexible(child: Text(ids.isEmpty ? '-' : ids.join(', '))),
        ],
      ),
    );
  }
}
