import 'package:flutter/material.dart';
import '../../models/extra_charge.dart';

class ExtraChargeDetails extends StatelessWidget {
  final ExtraCharge extraCharge;
  const ExtraChargeDetails({super.key, required this.extraCharge});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Name: ${extraCharge.name}', style: Theme.of(context).textTheme.titleMedium),
        if (extraCharge.description != null)
          Text('Description: ${extraCharge.description}'),
        if (extraCharge.icon != null)
          Text('Icon: ${extraCharge.icon}'),
        if (extraCharge.logo != null)
          Text('Logo: ${extraCharge.logo}'),
        if (extraCharge.facilityId != null)
          Text('Facility ID: ${extraCharge.facilityId}'),
      ],
    );
  }
}
