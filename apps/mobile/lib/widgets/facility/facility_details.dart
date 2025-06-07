import 'package:flutter/material.dart';
import '../../models/facility.dart';

class FacilityDetails extends StatelessWidget {
  final Facility facility;
  const FacilityDetails({super.key, required this.facility});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(facility.name, style: Theme.of(context).textTheme.titleLarge),
        // Add more fields as needed
      ],
    );
  }
}
