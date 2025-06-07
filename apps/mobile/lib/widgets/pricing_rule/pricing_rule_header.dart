import 'package:flutter/material.dart';

class PricingRuleHeader extends StatelessWidget {
  final int pricingRuleCount;
  final String? title;
  const PricingRuleHeader({super.key, required this.pricingRuleCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$pricingRuleCount pricing rules found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
