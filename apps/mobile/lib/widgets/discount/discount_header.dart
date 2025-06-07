import 'package:flutter/material.dart';

class DiscountHeader extends StatelessWidget {
  final int discountCount;
  final String? title;
  const DiscountHeader({super.key, required this.discountCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$discountCount discounts found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
