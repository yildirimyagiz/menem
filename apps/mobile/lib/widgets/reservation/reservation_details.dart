import 'package:flutter/material.dart';
import '../../models/reservation.dart';

class ReservationDetails extends StatelessWidget {
  final Reservation reservation;
  const ReservationDetails({super.key, required this.reservation});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Reservation ID: ${reservation.id}', style: Theme.of(context).textTheme.titleMedium),
        Text('Type: ${reservation.type.name}'),
        Text('Status: ${reservation.status.name}'),
        Text('Start: ${reservation.startTime}'),
        Text('End: ${reservation.endTime}'),
        if (reservation.numberOfGuests != null)
          Text('Guests: ${reservation.numberOfGuests}'),
        if (reservation.notes != null)
          Text('Notes: ${reservation.notes}'),
        if (reservation.createdBy != null)
          Text('Created by: ${reservation.createdBy}'),
        if (reservation.updatedBy != null)
          Text('Updated by: ${reservation.updatedBy}'),
      ],
    );
  }
}
