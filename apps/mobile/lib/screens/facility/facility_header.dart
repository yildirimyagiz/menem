import 'package:flutter/material.dart';

class FacilityHeader extends StatelessWidget {
  final int count;
  const FacilityHeader({super.key, required this.count});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Facilities', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Chip(label: Text('$count')),
      ],
    );
  }
}
