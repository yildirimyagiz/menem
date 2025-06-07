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
        onTap: onTap,
        leading: const Icon(Icons.attach_money),
        title: Text(extraCharge.name),
        subtitle: Text(extraCharge.description ?? '-'),
        trailing: extraCharge.facilityId != null ? Chip(label: Text(extraCharge.facilityId!)) : null,
      ),
    );
  }
}
