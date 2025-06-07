import 'package:flutter/material.dart';

class PropertySaleBadge extends StatelessWidget {
  final double? saleOff;
  const PropertySaleBadge({super.key, this.saleOff});

  @override
  Widget build(BuildContext context) {
    if (saleOff == null || saleOff == 0) return const SizedBox.shrink();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.redAccent,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        '-${saleOff!.toStringAsFixed(0)}%',
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
