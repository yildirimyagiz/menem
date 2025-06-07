import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/analytics.dart';
import 'package:mobile/generated/l10n.dart';

class AnalyticsDetailScreen extends StatelessWidget {
  String _getLocalizedAnalyticsType(BuildContext context, AnalyticsType type) {
    final s = AppLocalizations.of(context);
    switch (type) {
      case AnalyticsType.listingView:
        return s?.analyticsTypeListingView ?? 'Listing View';
      case AnalyticsType.bookingConversion:
        return s?.analyticsTypeBookingConversion ?? 'Booking Conversion';
      case AnalyticsType.userEngagement:
        return s?.analyticsTypeUserEngagement ?? 'User Engagement';
      case AnalyticsType.revenue:
        return s?.analyticsTypeRevenue ?? 'Revenue';
      case AnalyticsType.performance:
        return s?.analyticsTypePerformance ?? 'Performance';
      case AnalyticsType.agentPerformance:
        return s?.analyticsTypeAgentPerformance ?? 'Agent Performance';
      case AnalyticsType.agencyPerformance:
        return s?.analyticsTypeAgencyPerformance ?? 'Agency Performance';
      case AnalyticsType.view:
        return s?.analyticsTypeView ?? 'View';
    }
  }

  final Analytics analytics;

  const AnalyticsDetailScreen({super.key, required this.analytics});

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(s?.analyticsDetailTitle ?? 'Analytics Details'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailItem(s?.analyticsType ?? 'Type',
                _getLocalizedAnalyticsType(context, analytics.type)),
            _buildDetailItem(
                s?.analyticsEntityType ?? 'Entity Type', analytics.entityType),
            _buildDetailItem(
                s?.analyticsEntityId ?? 'Entity ID', analytics.entityId),
            _buildDetailItem(s?.analyticsTimestamp ?? 'Timestamp',
                DateFormat.yMMMd().add_jm().format(analytics.timestamp)),
            if (analytics.propertyId != null)
              _buildDetailItem(s?.analyticsPropertyId ?? 'Property ID',
                  analytics.propertyId),
            if (analytics.userId != null)
              _buildDetailItem(
                  s?.analyticsUserId ?? 'User ID', analytics.userId),
            if (analytics.agentId != null)
              _buildDetailItem(
                  s?.analyticsAgentId ?? 'Agent ID', analytics.agentId),
            if (analytics.agencyId != null)
              _buildDetailItem(
                  s?.analyticsAgencyId ?? 'Agency ID', analytics.agencyId),
            if (analytics.reservationId != null)
              _buildDetailItem(s?.analyticsReservationId ?? 'Reservation ID',
                  analytics.reservationId),
            if (analytics.taskId != null)
              _buildDetailItem(
                  s?.analyticsTaskId ?? 'Task ID', analytics.taskId),
            // analytics.deletedAt is DateTime?
            // DateFormat.format expects DateTime.
            // Inside the if block, analytics.deletedAt is promoted to DateTime.
            if (analytics.deletedAt != null)
              _buildDetailItem(s?.analyticsDeletedAt ?? 'Deleted At',
                  DateFormat.yMMMd().format(analytics.deletedAt!)),
            _buildDetailItem(s?.analyticsCreatedAt ?? 'Created At',
                DateFormat.yMMMd().add_jm().format(analytics.createdAt!)),
            // analytics.updatedAt is DateTime?
            // DateFormat.format expects DateTime.
            _buildDetailItem(
                s?.analyticsUpdatedAt ?? 'Updated At',
                analytics.updatedAt == null
                    ? null
                    : DateFormat.yMMMd().add_jm().format(analytics.updatedAt!)),
            const SizedBox(height: 16),
            Text(s?.analyticsData ?? 'Data',
                style: Theme.of(context).textTheme.titleMedium),
            SelectableText(analytics.data.toString()),
            if (analytics.agency != null) ...[
              const SizedBox(height: 8),
              Text(s?.analyticsAgency ?? 'Agency',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(analytics.agency.toString()),
            ],
            if (analytics.agent != null) ...[
              const SizedBox(height: 8),
              Text(s?.analyticsAgent ?? 'Agent',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(analytics.agent.toString()),
            ],
            if (analytics.property != null) ...[
              const SizedBox(height: 8),
              Text(s?.eventProperty ?? 'Property',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(analytics.property.toString()),
            ],
            if (analytics.reservation != null) ...[
              const SizedBox(height: 8),
              Text(s?.analyticsReservationId ?? 'Reservation ID',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(analytics.reservation.toString()),
            ],
            if (analytics.task != null) ...[
              const SizedBox(height: 8),
              Text(s?.analyticsTaskId ?? 'Task ID',
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(analytics.task.toString()),
            ],
            if (analytics.user != null) ...[
              const SizedBox(height: 8),
              Text('User:', style: Theme.of(context).textTheme.titleSmall),
              SelectableText(analytics.user.toString()),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(String label, String? value) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 120,
              child: Text(label,
                  style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
