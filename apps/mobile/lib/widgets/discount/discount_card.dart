import 'package:flutter/material.dart';
import '../../models/discount.dart';
import 'discount_details.dart';

class DiscountCard extends StatelessWidget {
  final Discount discount;
  final VoidCallback? onTap;

  const DiscountCard({super.key, required this.discount, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: DiscountDetails(discount: discount),
        ),
      ),
    );
  }
}
