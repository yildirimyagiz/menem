import 'package:flutter/material.dart';

class ReservationHeader extends StatelessWidget {
  final int reservationCount;
  final String? title;
  const ReservationHeader({super.key, required this.reservationCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$reservationCount reservations found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
