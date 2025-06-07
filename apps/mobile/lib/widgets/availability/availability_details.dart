import 'package:flutter/material.dart';
import '../../models/availability.dart';

class AvailabilityDetails extends StatelessWidget {
  final Availability availability;
  const AvailabilityDetails({super.key, required this.availability});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Availability', style: Theme.of(context).textTheme.titleLarge),
        // Add more fields as needed
      ],
    );
  }
}
