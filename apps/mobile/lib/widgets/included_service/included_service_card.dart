import 'package:flutter/material.dart';
import '../../models/included_service.dart';
import 'included_service_details.dart';

class IncludedServiceCard extends StatelessWidget {
  final IncludedService includedService;
  final VoidCallback? onTap;

  const IncludedServiceCard({super.key, required this.includedService, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: IncludedServiceDetails(includedService: includedService),
        ),
      ),
    );
  }
}
