import 'package:flutter/material.dart';

class NotificationHeader extends StatelessWidget {
  final int notificationCount;
  final String? title;
  const NotificationHeader({super.key, required this.notificationCount, this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Text(title!, style: Theme.of(context).textTheme.headlineSmall),
        Text('$notificationCount notifications found', style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
