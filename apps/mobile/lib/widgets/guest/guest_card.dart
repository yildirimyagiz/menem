import 'package:flutter/material.dart';
import '../../models/guest.dart';
import 'guest_details.dart';

class GuestCard extends StatelessWidget {
  final Guest guest;
  final VoidCallback? onTap;

  const GuestCard({super.key, required this.guest, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: GuestDetails(guest: guest),
        ),
      ),
    );
  }
}
