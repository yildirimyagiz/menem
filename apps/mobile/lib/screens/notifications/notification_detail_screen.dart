import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../models/notification.dart' as models;
import '../../providers/notification_provider.dart';

class NotificationDetailScreen extends ConsumerWidget {
  final models.Notification notification;

  const NotificationDetailScreen({
    super.key,
    required this.notification,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () {
              ref
                  .read(notificationsNotifierProvider.notifier)
                  .delete(notification.id);
              Navigator.of(context).pop();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(context),
            const SizedBox(height: 24),
            _buildContent(context),
            const SizedBox(height: 24),
            _buildMetadata(context),
            if (notification.entityId != null) ...[
              const SizedBox(height: 24),
              _buildRelatedEntity(context),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          backgroundColor: _getNotificationColor(notification.type),
          radius: 24,
          child: Icon(
            _getNotificationIcon(notification.type),
            color: Colors.white,
            size: 24,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _getNotificationTypeLabel(notification.type),
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 4),
              Text(
                DateFormat('MMM d, y • h:mm a').format(notification.createdAt!),
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: notification.isRead
                ? Colors.grey[200]
                : Theme.of(context).primaryColor,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            notification.isRead ? 'Read' : 'Unread',
            style: TextStyle(
              color: notification.isRead ? Colors.grey[600] : Colors.white,
              fontSize: 12,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContent(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: notification.content != null
            ? Text(
                notification.content!,
                style: Theme.of(context).textTheme.bodyLarge,
              )
            : const SizedBox.shrink(),
      ),
    );
  }

  Widget _buildMetadata(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Details',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            _buildMetadataRow('ID', notification.id),
            if (notification.entityId != null)
              _buildMetadataRow('Entity ID', notification.entityId!),
            if (notification.entityType != null)
              _buildMetadataRow('Entity Type', notification.entityType!),
            if (notification.agencyId != null)
              _buildMetadataRow('Agency ID', notification.agencyId!),
            if (notification.agentId != null)
              _buildMetadataRow('Agent ID', notification.agentId!),
            if (notification.tenantId != null)
              _buildMetadataRow('Tenant ID', notification.tenantId!),
            if (notification.reviewId != null)
              _buildMetadataRow('Review ID', notification.reviewId!),
          ],
        ),
      ),
    );
  }

  Widget _buildMetadataRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  Widget _buildRelatedEntity(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Related Information',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            if (notification.agency != null)
              _buildEntityInfo('Agency', notification.agency!),
            if (notification.agent != null)
              _buildEntityInfo('Agent', notification.agent!),
            if (notification.tenant != null)
              _buildEntityInfo('Tenant', notification.tenant!),
            if (notification.review != null)
              _buildEntityInfo('Review', notification.review!),
            if (notification.user != null)
              _buildEntityInfo('User', notification.user!),
          ],
        ),
      ),
    );
  }

  Widget _buildEntityInfo(String label, Map<String, dynamic> data) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 8),
          ...data.entries.map((entry) => Padding(
                padding: const EdgeInsets.only(left: 16, bottom: 4),
                child: Text('${entry.key}: ${entry.value}'),
              )),
        ],
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
        return Colors.lightBlue;
      case models.NotificationType.warning:
        return Colors.yellow;
      case models.NotificationType.price:
        return Colors.orangeAccent;
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
        throw UnimplementedError();
      case models.NotificationType.warning:
        return Icons.warning;
      case models.NotificationType.price:
        return Icons.attach_money;
    }
  }

  String _getNotificationTypeLabel(models.NotificationType type) {
    switch (type) {
      case models.NotificationType.message:
        return 'Message';
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
      case models.NotificationType.priceChange:
        return 'Price Change';
      case models.NotificationType.availability:
        return 'Availability';
      case models.NotificationType.system:
        return 'System';
      case models.NotificationType.other:
        return 'Other';
      case models.NotificationType.listing:
        return 'Listing';

      case models.NotificationType.warning:
        return 'warning';

      case models.NotificationType.price:
        return '';
    }
  }
}
