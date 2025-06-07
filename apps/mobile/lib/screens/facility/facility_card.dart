import 'package:flutter/material.dart';
import '../../models/facility.dart';
import 'package:intl/intl.dart';

class FacilityCard extends StatelessWidget {
  final Facility facility;
  final VoidCallback? onTap;
  const FacilityCard({super.key, required this.facility, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.home_work),
        title: Text(facility.name),
        subtitle: Text(
            '${facility.type.toString().split('.').last} • ${facility.status.toString().split('.').last}'),
        trailing: Text(DateFormat.yMMMd().format(facility.createdAt!)),
      ),
    );
  }
}
