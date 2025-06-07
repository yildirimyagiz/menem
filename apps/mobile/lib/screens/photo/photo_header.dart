import 'package:flutter/material.dart';

class PhotoHeader extends StatelessWidget {
  final int count;
  const PhotoHeader({super.key, required this.count});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Photos', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Chip(label: Text('$count')),
      ],
    );
  }
}
