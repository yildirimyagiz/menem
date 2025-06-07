import 'package:flutter/material.dart';
import '../../models/pricing_rule.dart';
import 'pricing_rule_details.dart';

class PricingRuleCard extends StatelessWidget {
  final PricingRule pricingRule;
  final VoidCallback? onTap;

  const PricingRuleCard({super.key, required this.pricingRule, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: PricingRuleDetails(pricingRule: pricingRule),
        ),
      ),
    );
  }
}
