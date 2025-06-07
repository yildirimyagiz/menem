import 'package:flutter/material.dart';
import '../badge.dart' as custom;

class NotificationBell extends StatelessWidget {
  final int count;
  const NotificationBell({super.key, this.count = 0});
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        IconButton(
          icon: const Icon(Icons.notifications),
          onPressed: () {},
        ),
        if (count > 0)
          Positioned(
            right: 4,
            top: 4,
            child: custom.Badge(count: count),
          ),
      ],
    );
  }
}
