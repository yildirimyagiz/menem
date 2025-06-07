import 'package:flutter/material.dart' hide Notification;
import '../../models/notification.dart';
import 'package:intl/intl.dart';

class NotificationCard extends StatelessWidget {
  final Notification notification;
  final VoidCallback? onTap;
  const NotificationCard({super.key, required this.notification, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: Icon(
          notification.isRead
              ? Icons.notifications
              : Icons.notifications_active,
          color: notification.isRead ? Colors.green : Colors.red,
        ),
        title: Text(notification.title),
        subtitle: Text(notification.message,
            maxLines: 1, overflow: TextOverflow.ellipsis),
        trailing: Text(DateFormat.yMMMd()
            .format(notification.createdAt!)), // Assert non-null
      ),
    );
  }
}
