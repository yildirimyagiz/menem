import 'package:flutter/material.dart';

class Badge extends StatelessWidget {
  final int count;
  final Color color;
  final double size;
  const Badge(
      {super.key,
      required this.count,
      this.color = Colors.red,
      this.size = 16});

  @override
  Widget build(BuildContext context) {
    if (count <= 0) return const SizedBox.shrink();
    return Container(
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(
          color: color, borderRadius: BorderRadius.circular(size)),
      constraints: BoxConstraints(minWidth: size, minHeight: size),
      child: Center(
        child: Text('$count',
            style: const TextStyle(color: Colors.white, fontSize: 10)),
      ),
    );
  }
}
