import 'package:intl/intl.dart';
import '../models/notification.dart' as models;

class NotificationUtils {
  static String formatDate(DateTime? date) {
    if (date == null) return 'Unknown date';

    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        if (difference.inMinutes == 0) {
          return 'Just now';
        }
        return '${difference.inMinutes}m ago';
      }
      return '${difference.inHours}h ago';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return DateFormat('EEEE').format(date);
    } else {
      return DateFormat('MMM d, y').format(date);
    }
  }

  static Map<String, List<models.Notification>> groupNotificationsByDate(
    List<models.Notification> notifications,
  ) {
    final grouped = <String, List<models.Notification>>{};

    for (final notification in notifications) {
      final dateKey = formatDate(notification.createdAt);
      grouped.putIfAbsent(dateKey, () => []).add(notification);
    }

    return Map.fromEntries(
      grouped.entries.toList()
        ..sort((a, b) {
          final dateA = a.value.first.createdAt;
          final dateB = b.value.first.createdAt;
          if (dateA == null || dateB == null) return 0;
          return dateB.compareTo(dateA);
        }),
    );
  }

  static int getUnreadCount(List<models.Notification> notifications) {
    return notifications.where((n) => !n.isRead).length;
  }

  static Map<String, List<models.Notification>> groupNotificationsByType(
    List<models.Notification> notifications,
  ) {
    final grouped = <String, List<models.Notification>>{};

    for (final notification in notifications) {
      final typeKey = _getNotificationTypeLabel(notification.type);
      grouped.putIfAbsent(typeKey, () => []).add(notification);
    }

    return Map.fromEntries(
      grouped.entries.toList()
        ..sort((a, b) {
          final countA = a.value.length;
          final countB = b.value.length;
          return countB.compareTo(countA);
        }),
    );
  }

  static String _getNotificationTypeLabel(models.NotificationType type) {
    switch (type) {
      case models.NotificationType.listing:
        return 'Listing';

      case models.NotificationType.warning:
        return 'Warning';

      case models.NotificationType.booking:
        return 'Booking';
      case models.NotificationType.mention:
        return 'Mention';
      case models.NotificationType.like:
        return 'Like';
      case models.NotificationType.comment:
        return 'Comment';
      case models.NotificationType.follow:
        return 'Follow';
      case models.NotificationType.price:
        return 'Price Change';
      case models.NotificationType.availability:
        return 'Availability';
      case models.NotificationType.system:
        return 'System';
      case models.NotificationType.other:
        return 'Other';
      case models.NotificationType.message:
        return 'Message';
      case models.NotificationType.priceChange:
        // TODO: Handle this case.
        throw UnimplementedError();
    }
  }
}
