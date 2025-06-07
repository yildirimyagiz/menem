import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/commission_rule.dart';

class CommissionRuleDetailScreen extends StatelessWidget {
  final CommissionRule commissionRule;
  const CommissionRuleDetailScreen({super.key, required this.commissionRule});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();

    return Scaffold(
      appBar: AppBar(title: const Text('Commission Rule Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailItem('Provider ID', commissionRule.providerId),
            _buildDetailItem('Type', commissionRule.ruleType.name),
            _buildDetailItem(
                'Commission', commissionRule.commission.toString()),
            if (commissionRule.startDate != null)
              _buildDetailItem('Start Date',
                  yMMMdFormatter.format(commissionRule.startDate!)),
            if (commissionRule.endDate != null)
              _buildDetailItem(
                  'End Date', yMMMdFormatter.format(commissionRule.endDate!)),
            if (commissionRule.minVolume != null)
              _buildDetailItem(
                  'Min Volume', commissionRule.minVolume.toString()),
            if (commissionRule.maxVolume != null)
              _buildDetailItem(
                  'Max Volume', commissionRule.maxVolume.toString()),
            if (commissionRule.conditions != null) ...[
              const SizedBox(height: 8),
              Text('Conditions:',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(commissionRule.conditions.toString()),
            ],
            if (commissionRule.provider != null) ...[
              const SizedBox(height: 8),
              Text('Provider:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(commissionRule.provider.toString()),
            ],
            _buildDetailItem(
                'Created At',
                commissionRule.createdAt == null
                    ? null
                    : yMMMdJmFormatter.format(commissionRule.createdAt!)),
            _buildDetailItem(
                'Updated At',
                commissionRule.updatedAt == null
                    ? null
                    : yMMMdJmFormatter.format(commissionRule.updatedAt!)),
            if (commissionRule.deletedAt != null)
              _buildDetailItem('Deleted At',
                  yMMMdFormatter.format(commissionRule.deletedAt!)),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(String label, String? value) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 140,
              child: Text(label,
                  style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
