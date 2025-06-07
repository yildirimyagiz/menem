import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/notification_provider.dart';
import '../../models/notification.dart' as app;

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notificationsState = ref.watch(notificationsNotifierProvider);

    return notificationsState.when(
      data: (notifications) {
        if (notifications.isEmpty) {
          return const Center(
            child: Text('No notifications yet'),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: notifications.length,
          itemBuilder: (context, index) {
            final notification = notifications[index];
            return Card(
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: _getNotificationColor(notification.type),
                  child: Icon(
                    _getNotificationIcon(notification.type),
                    color: Colors.white,
                  ),
                ),
                title: Text(notification.title),
                subtitle: Text(
                  notification.message,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      _formatDate(notification.createdAt ?? DateTime.now()),
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    if (!notification.isRead)
                      Container(
                        margin: const EdgeInsets.only(top: 4),
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.circle,
                          size: 8,
                          color: Colors.white,
                        ),
                      ),
                  ],
                ),
                onTap: () {
                  ref
                      .read(notificationsNotifierProvider.notifier)
                      .markAsRead(notification.id);
                },
              ),
            );
          },
        );
      },
      loading: () => const Center(
        child: CircularProgressIndicator(),
      ),
      error: (error, stackTrace) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Error loading notifications',
              style: TextStyle(
                color: Theme.of(context).colorScheme.error,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                ref.invalidate(notificationNotifierProvider);
              },
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Color _getNotificationColor(app.NotificationType type) {
    switch (type) {
      case app.NotificationType.message:
        return Colors.blue;
      case app.NotificationType.listing:
        return Colors.green;
      case app.NotificationType.system:
        return Colors.orange;
      case app.NotificationType.warning:
        return Colors.red;
      case app.NotificationType.booking:
        return Colors.purple;
      case app.NotificationType.mention:
        return Colors.teal;
      case app.NotificationType.like:
        return Colors.pink;
      case app.NotificationType.comment:
        return Colors.indigo;
      case app.NotificationType.follow:
        return Colors.lightBlue;
      case app.NotificationType.price:
        return Colors.amber;
      case app.NotificationType.availability:
        return Colors.brown;
      case app.NotificationType.other:
        return Colors.grey;
      case app.NotificationType.priceChange:
        return Colors.deepOrange;
    }
  }

  IconData _getNotificationIcon(app.NotificationType type) {
    switch (type) {
      case app.NotificationType.message:
        return Icons.message;
      case app.NotificationType.listing:
        return Icons.home;
      case app.NotificationType.system:
        return Icons.info;
      case app.NotificationType.warning:
        return Icons.warning;
      case app.NotificationType.booking:
        return Icons.event;
      case app.NotificationType.mention:
        return Icons.alternate_email;
      case app.NotificationType.like:
        return Icons.favorite;
      case app.NotificationType.comment:
        return Icons.comment;
      case app.NotificationType.follow:
        return Icons.person_add;
      case app.NotificationType.price:
        return Icons.attach_money;
      case app.NotificationType.availability:
        return Icons.event_available;
      case app.NotificationType.other:
        return Icons.notifications;
      case app.NotificationType.priceChange:
        return Icons.trending_up;
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
