import 'package:flutter/material.dart';
import '../../models/availability.dart';
import 'availability_details.dart';

class AvailabilityCard extends StatelessWidget {
  final Availability availability;
  final VoidCallback? onTap;

  const AvailabilityCard({super.key, required this.availability, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: AvailabilityDetails(availability: availability),
        ),
      ),
    );
  }
}
