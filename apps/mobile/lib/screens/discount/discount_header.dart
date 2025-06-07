import 'package:flutter/material.dart';

class DiscountHeader extends StatelessWidget {
  final int count;
  const DiscountHeader({super.key, required this.count});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Discounts', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Chip(label: Text('$count')),
      ],
    );
  }
}
