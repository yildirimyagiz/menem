import 'package:flutter/material.dart';
import '../../models/reservation.dart';
import 'package:intl/intl.dart';

class ReservationCard extends StatelessWidget {
  final Reservation reservation;
  final VoidCallback? onTap;
  const ReservationCard({super.key, required this.reservation, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.event),
        title: Text(reservation.type.toString().split('.').last),
        subtitle: Text(reservation.status.toString().split('.').last),
        trailing: Text(DateFormat.yMMMd().format(reservation.startTime)),
      ),
    );
  }
}
