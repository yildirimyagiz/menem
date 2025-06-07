import 'package:flutter/material.dart';
import '../../models/guest.dart';

class GuestCard extends StatelessWidget {
  final Guest guest;
  final VoidCallback? onTap;
  const GuestCard({super.key, required this.guest, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.person),
        title: Text('${guest.firstName} ${guest.lastName}'),
        subtitle: Text(guest.status.toString().split('.').last),
        trailing: guest.email != null ? Chip(label: Text(guest.email!)) : null,
      ),
    );
  }
}
