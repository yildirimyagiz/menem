import 'package:flutter/material.dart';
import '../../models/guest.dart';

class GuestDetails extends StatelessWidget {
  final Guest guest;
  const GuestDetails({super.key, required this.guest});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Guest: ${guest.name}', style: Theme.of(context).textTheme.titleLarge),
        Text('Email: ${guest.email}'),
        // Add more fields as needed
      ],
    );
  }
}
