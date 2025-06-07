import 'package:flutter/material.dart';
import '../../models/extra_charge.dart';

class ExtraChargeCard extends StatelessWidget {
  final ExtraCharge extraCharge;
  final VoidCallback? onTap;
  const ExtraChargeCard({super.key, required this.extraCharge, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const Icon(Icons.add_circle_outline),
        title: Text(extraCharge.name),
        subtitle: Text(extraCharge.description ?? ''),
        onTap: onTap,
      ),
    );
  }
}
