import 'package:flutter/material.dart';

class NotificationDropdown extends StatelessWidget {
  final List<String> notifications;
  final VoidCallback onViewAll;
  const NotificationDropdown({super.key, required this.notifications, required this.onViewAll});

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<int>(
      icon: const Icon(Icons.notifications),
      itemBuilder: (context) => [
        ...notifications.take(5).map((n) => PopupMenuItem(
              value: notifications.indexOf(n),
              child: ListTile(title: Text(n)),
            )),
        if (notifications.length > 5) const PopupMenuDivider(),
        PopupMenuItem(
          value: -1,
          child: ListTile(
            title: const Text('View All'),
            onTap: onViewAll,
          ),
        ),
      ],
    );
  }
}
