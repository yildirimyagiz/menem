import 'package:flutter/material.dart';
import '../../models/included_service.dart';

class IncludedServiceCard extends StatelessWidget {
  final IncludedService includedService;
  final VoidCallback? onTap;
  const IncludedServiceCard({super.key, required this.includedService, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.room_service),
        title: Text(includedService.name),
        subtitle: Text(includedService.description ?? '-'),
        trailing: includedService.facilityId != null ? Chip(label: Text(includedService.facilityId!)) : null,
      ),
    );
  }
}
