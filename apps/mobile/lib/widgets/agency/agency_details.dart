import 'package:flutter/material.dart';
import '../../models/agency.dart';

class AgencyDetails extends StatelessWidget {
  final Agency agency;
  const AgencyDetails({super.key, required this.agency});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(agency.name, style: Theme.of(context).textTheme.titleLarge),
        if (agency.description != null)
          Text(agency.description!),
        // Add more fields as needed
      ],
    );
  }
}
