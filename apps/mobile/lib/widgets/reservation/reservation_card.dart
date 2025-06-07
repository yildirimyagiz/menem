import 'package:flutter/material.dart';
import '../../models/reservation.dart';
import 'reservation_details.dart';

class ReservationCard extends StatelessWidget {
  final Reservation reservation;
  final VoidCallback? onTap;

  const ReservationCard({super.key, required this.reservation, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ReservationDetails(reservation: reservation),
        ),
      ),
    );
  }
}
