import 'package:flutter/material.dart';

class ReservationHeader extends StatelessWidget {
  final int count;
  const ReservationHeader({super.key, required this.count});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Reservations', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Chip(label: Text('$count')),
      ],
    );
  }
}
