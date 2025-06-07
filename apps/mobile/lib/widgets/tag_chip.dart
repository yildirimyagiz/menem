import 'package:flutter/material.dart';

class TagChip extends StatelessWidget {
  final String label;
  final Color? color;

  const TagChip({super.key, required this.label, this.color});

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(label),
      backgroundColor: color ?? Theme.of(context).primaryColor.withAlpha(128),
    );
  }
}
