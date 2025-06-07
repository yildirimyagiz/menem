import 'package:flutter/material.dart';

class ExtraChargeHeader extends StatelessWidget {
  final int extraChargeCount;
  const ExtraChargeHeader({super.key, required this.extraChargeCount});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text('Extra Charges', style: Theme.of(context).textTheme.headlineSmall),
        Chip(label: Text('$extraChargeCount')),
      ],
    );
  }
}
