import 'package:flutter/material.dart';
import '../../models/facility.dart';
import 'facility_details.dart';

class FacilityCard extends StatelessWidget {
  final Facility facility;
  final VoidCallback? onTap;

  const FacilityCard({super.key, required this.facility, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: FacilityDetails(facility: facility),
        ),
      ),
    );
  }
}
