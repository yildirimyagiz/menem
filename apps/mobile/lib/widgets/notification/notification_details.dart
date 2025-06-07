import 'package:flutter/material.dart' hide Notification;
import '../../models/notification.dart'; // Import the actual Notification model

class NotificationDetails extends StatelessWidget {
  final Notification notification;
  const NotificationDetails({super.key, required this.notification});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(notification.title, style: Theme.of(context).textTheme.titleLarge),
        Text(notification.message),
        Text('Type: ${notification.type.name}'),
        Text('Read: ${notification.isRead ? "Yes" : "No"}'),
        Text(
          'Created: '
          '${notification.createdAt != null ? notification.createdAt!.toLocal().toString() : 'Unknown'}',
        ),
      ],
    );
  }
}
