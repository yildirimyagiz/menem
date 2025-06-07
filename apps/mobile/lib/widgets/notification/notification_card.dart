import 'package:flutter/material.dart';
import 'notification_details.dart';
import '../../models/notification.dart' as notif;

class NotificationCard extends StatelessWidget {
  final notif.Notification notification;
  final VoidCallback? onTap;

  const NotificationCard({super.key, required this.notification, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: NotificationDetails(notification: notification),
        ),
      ),
    );
  }
}
