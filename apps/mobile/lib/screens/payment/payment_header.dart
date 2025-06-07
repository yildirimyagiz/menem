import 'package:flutter/material.dart';

class PaymentHeader extends StatelessWidget {
  final int count;
  const PaymentHeader({super.key, required this.count});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Payments', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Chip(label: Text('$count')),
      ],
    );
  }
}
