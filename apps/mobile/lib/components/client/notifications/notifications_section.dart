import 'package:flutter/material.dart';
import '../../../models/notification.dart' as model;

class NotificationsSection extends StatelessWidget {
  final List<model.Notification> notifications;
  final void Function(model.Notification)? onTapNotification;
  const NotificationsSection(
      {super.key, this.notifications = const [], this.onTapNotification});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Notifications',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            if (notifications.isEmpty) const Text('No notifications.'),
            if (notifications.isNotEmpty)
              ...notifications.map((n) => ListTile(
                    leading: Icon(_iconForType(n.type),
                        color: n.isRead
                            ? Colors.grey
                            : Theme.of(context).colorScheme.primary),
                    title: Text(n.title,
                        style: TextStyle(
                            fontWeight: n.isRead
                                ? FontWeight.normal
                                : FontWeight.bold)),
                    subtitle: Text(n.message,
                        maxLines: 2, overflow: TextOverflow.ellipsis),
                    trailing: n.isRead
                        ? null
                        : Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                                color: Theme.of(context).colorScheme.primary,
                                shape: BoxShape.circle)),
                    onTap: onTapNotification != null
                        ? () => onTapNotification!(n)
                        : null,
                  ))
          ],
        ),
      ),
    );
  }
}

IconData _iconForType(model.NotificationType type) {
  switch (type) {
    case model.NotificationType.message:
      return Icons.message;
    case model.NotificationType.listing:
      return Icons.home_work;
    case model.NotificationType.system:
      return Icons.settings;
    case model.NotificationType.warning:
      return Icons.warning;
    case model.NotificationType.booking:
      return Icons.event;
    case model.NotificationType.mention:
      return Icons.alternate_email;
    case model.NotificationType.like:
      return Icons.thumb_up;
    case model.NotificationType.comment:
      return Icons.comment;
    case model.NotificationType.follow:
      return Icons.person_add;
    case model.NotificationType.price:
      return Icons.attach_money;
    case model.NotificationType.availability:
      return Icons.event_available;
    case model.NotificationType.other:
      return Icons.notifications;
    case model.NotificationType.priceChange:
      return Icons.trending_up;
  }
}
