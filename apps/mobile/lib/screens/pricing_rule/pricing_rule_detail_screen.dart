import 'package:flutter/material.dart';
import '../../models/pricing_rule.dart';
import 'package:intl/intl.dart';

class PricingRuleDetailScreen extends StatelessWidget {
  final PricingRule pricingRule;
  const PricingRuleDetailScreen({super.key, required this.pricingRule});

  String? _formatDate(DateTime? date) =>
      date != null ? DateFormat.yMMMd().add_jm().format(date) : null;

  Widget _buildDetailItem(String label, String? value, {bool selectable = false}) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 140,
              child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(
            child: selectable
                ? SelectableText(value)
                : Text(value),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pricing Rule Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildDetailItem('ID', pricingRule.id),
                _buildDetailItem('Name', pricingRule.name),
                _buildDetailItem('Description', pricingRule.description),
                _buildDetailItem('Type', pricingRule.type.toString().split('.').last),
                _buildDetailItem('Status', pricingRule.status.toString().split('.').last),
                _buildDetailItem('Multiplier', pricingRule.multiplier.toString()),
                _buildDetailItem('Fixed Price', pricingRule.fixedPrice?.toString()),
                _buildDetailItem('Is Active', pricingRule.isActive ? 'Yes' : 'No'),
                _buildDetailItem('Property ID', pricingRule.propertyId),
                _buildDetailItem('Created At', _formatDate(pricingRule.createdAt)),
                _buildDetailItem('Updated At', _formatDate(pricingRule.updatedAt)),
                _buildDetailItem('Deleted At', _formatDate(pricingRule.deletedAt)),
                if (pricingRule.conditions != null && pricingRule.conditions!.isNotEmpty)
                  _buildDetailItem('Conditions', pricingRule.conditions.toString(), selectable: true),
                if (pricingRule.property != null)
                  _buildDetailItem('Property', pricingRule.property!.toString(), selectable: true),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
