import 'package:flutter/material.dart';

class Badge extends StatelessWidget {
  final Widget? label;
  final bool isLabelVisible;
  final Widget child;

  const Badge({super.key, this.label, this.isLabelVisible = true, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.topRight,
      children: [
        child,
        if (isLabelVisible && label != null)
          Positioned(
            right: 0,
            top: 0,
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: BorderRadius.circular(8),
              ),
              constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
              child: DefaultTextStyle(
                style: const TextStyle(color: Colors.white, fontSize: 10),
                child: label!,
              ),
            ),
          ),
      ],
    );
  }
}
