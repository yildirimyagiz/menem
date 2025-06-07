import 'package:flutter/material.dart';
import '../models/notification.dart' as models;
import 'package:intl/intl.dart';

class NotificationTile extends StatefulWidget {
  final models.Notification notification;
  final VoidCallback onTap;
  final VoidCallback onDismiss;

  const NotificationTile({
    super.key,
    required this.notification,
    required this.onTap,
    required this.onDismiss,
  });

  @override
  State<NotificationTile> createState() => _NotificationTileState();
}

class _NotificationTileState extends State<NotificationTile>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
      ),
    );

    _opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeIn,
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacityAnimation,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Dismissible(
          key: Key(widget.notification.id),
          direction: DismissDirection.endToStart,
          onDismissed: (_) => widget.onDismiss(),
          background: Container(
            color: Colors.red,
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.only(right: 16),
            child: const Icon(
              Icons.delete,
              color: Colors.white,
            ),
          ),
          child: ListTile(
            leading: Stack(
              children: [
                CircleAvatar(
                  backgroundColor:
                      _getNotificationColor(widget.notification.type),
                  child: Icon(
                    _getNotificationIcon(widget.notification.type),
                    color: Colors.white,
                  ),
                ),
                if (!widget.notification.isRead)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.primary,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Theme.of(context).scaffoldBackgroundColor,
                          width: 2,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            title: Text(
              widget.notification.content ?? 'No content available',
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontWeight: widget.notification.isRead
                    ? FontWeight.normal
                    : FontWeight.bold,
              ),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (widget.notification.entityType != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      _getEntityTypeLabel(
                          widget.notification.entityType ?? 'Unknown'),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context).colorScheme.primary,
                          ),
                    ),
                  ),
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    widget.notification.createdAt != null
                        ? _formatDate(widget.notification.createdAt!)
                        : 'Unknown date',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
              ],
            ),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              _controller.reverse().then((_) {
                widget.onTap();
              });
            },
          ),
        ),
      ),
    );
  }

  Color _getNotificationColor(models.NotificationType type) {
    switch (type) {
      case models.NotificationType.message:
        return Colors.blue;
      case models.NotificationType.booking:
        return Colors.green;
      case models.NotificationType.mention:
        return Colors.orange;
      case models.NotificationType.like:
        return Colors.red;
      case models.NotificationType.comment:
        return Colors.purple;
      case models.NotificationType.follow:
        return Colors.teal;
      case models.NotificationType.priceChange:
        return Colors.amber;
      case models.NotificationType.availability:
        return Colors.indigo;
      case models.NotificationType.system:
        return Colors.grey;
      case models.NotificationType.other:
        return Colors.blueGrey;
      case models.NotificationType.listing:
        return Colors.brown;
      case models.NotificationType.warning:
        return Colors.deepOrange;
      case models.NotificationType.price:
        return Colors.lightGreen;
    }
  }

  IconData _getNotificationIcon(models.NotificationType type) {
    switch (type) {
      case models.NotificationType.message:
        return Icons.message;
      case models.NotificationType.booking:
        return Icons.calendar_today;
      case models.NotificationType.mention:
        return Icons.alternate_email;
      case models.NotificationType.like:
        return Icons.favorite;
      case models.NotificationType.comment:
        return Icons.comment;
      case models.NotificationType.follow:
        return Icons.person_add;
      case models.NotificationType.priceChange:
        return Icons.attach_money;
      case models.NotificationType.availability:
        return Icons.event_available;
      case models.NotificationType.system:
        return Icons.notifications;
      case models.NotificationType.other:
        return Icons.notifications_none;
      case models.NotificationType.listing:
        return Icons.list_alt;
      case models.NotificationType.warning:
        return Icons.warning_amber_rounded;
      case models.NotificationType.price:
        return Icons.monetization_on;
    }
  }

  String _getEntityTypeLabel(String entityType) {
    switch (entityType) {
      case 'property':
        return 'Property';
      case 'user':
        return 'User';
      case 'review':
        return 'Review';
      case 'booking':
        return 'Booking';
      case 'message':
        return 'Message';
      default:
        return entityType;
    }
  }

  String _formatDate(DateTime date) {
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
      return '${difference.inDays}d ago';
    } else {
      return DateFormat.yMd().format(date); // Using DateFormat for consistency
    }
  }
}
