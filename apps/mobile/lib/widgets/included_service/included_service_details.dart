import 'package:flutter/material.dart';
import '../../models/included_service.dart';

class IncludedServiceDetails extends StatelessWidget {
  final IncludedService includedService;
  const IncludedServiceDetails({super.key, required this.includedService});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(includedService.name, style: Theme.of(context).textTheme.titleLarge),
        // Add more fields as needed
      ],
    );
  }
}
