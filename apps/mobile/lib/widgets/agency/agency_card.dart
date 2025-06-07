import 'package:flutter/material.dart';
import '../../models/agency.dart';
import 'agency_details.dart';

class AgencyCard extends StatelessWidget {
  final Agency agency;
  final VoidCallback? onTap;

  const AgencyCard({super.key, required this.agency, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: AgencyDetails(agency: agency),
        ),
      ),
    );
  }
}
