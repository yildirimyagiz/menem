import 'package:flutter/material.dart';
import '../../models/pricing_rule.dart';

class PricingRuleDetails extends StatelessWidget {
  final PricingRule pricingRule;
  const PricingRuleDetails({super.key, required this.pricingRule});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Rule: ${pricingRule.name}', style: Theme.of(context).textTheme.titleLarge),
        // Add more fields as needed
      ],
    );
  }
}
