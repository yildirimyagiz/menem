import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../models/reservation.dart';
import '../../providers/reservation_provider.dart';

class ReservationDetailScreen extends ConsumerWidget {
  final Reservation reservation;

  const ReservationDetailScreen({
    super.key,
    required this.reservation,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reservation Details'),
        actions: [
          if (reservation.isPending || reservation.isConfirmed)
            IconButton(
              icon: const Icon(Icons.cancel),
              onPressed: () => _showCancelDialog(context, ref),
            ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () => _showDeleteDialog(context, ref),
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
            _buildDetails(context),
            const SizedBox(height: 24),
            _buildTimeline(context),
            if (reservation.notes != null) ...[
              const SizedBox(height: 24),
              _buildNotes(context),
            ],
            if (reservation.metadata != null) ...[
              const SizedBox(height: 24),
              _buildMetadata(context),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: _getStatusColor(reservation.status),
                  child: Icon(
                    _getReservationTypeIcon(reservation.type),
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _getReservationTypeLabel(reservation.type),
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _getReservationStatusLabel(reservation.status),
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: _getStatusColor(reservation.status),
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetails(BuildContext context) {
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
            _buildDetailRow(
              context,
              'Start Time',
              DateFormat('MMM d, y HH:mm').format(reservation.startTime),
            ),
            _buildDetailRow(
              context,
              'End Time',
              DateFormat('MMM d, y HH:mm').format(reservation.endTime),
            ),
            if (reservation.numberOfGuests != null)
              _buildDetailRow(
                context,
                'Number of Guests',
                reservation.numberOfGuests.toString(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeline(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Timeline',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            _buildTimelineItem(
              context,
              'Created',
              reservation.createdAt ?? DateTime.now(),
              Icons.add_circle,
            ),
            _buildTimelineItem(
              context,
              'Updated',
              reservation.updatedAt ?? DateTime.now(),
              Icons.update,
            ),
            if (reservation.deletedAt != null)
              _buildTimelineItem(
                context,
                'Deleted',
                reservation.deletedAt!,
                Icons.delete,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotes(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Notes',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            Text(reservation.notes!),
          ],
        ),
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
              'Additional Information',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            ...reservation.metadata!.entries.map(
              (entry) => _buildDetailRow(
                context,
                entry.key,
                entry.value.toString(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(
    BuildContext context,
    String label,
    DateTime date,
    IconData icon,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[600],
                      ),
                ),
                Text(
                  DateFormat('MMM d, y HH:mm').format(date),
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showCancelDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Reservation'),
        content: const Text(
          'Are you sure you want to cancel this reservation? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () {
              ref
                  .read(reservationsNotifierProvider.notifier)
                  .cancelReservation(reservation.id);
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            },
            child: const Text('Yes'),
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Reservation'),
        content: const Text(
          'Are you sure you want to delete this reservation? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () {
              ref
                  .read(reservationsNotifierProvider.notifier)
                  .deleteReservation(reservation.id);
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            },
            child: const Text('Yes'),
          ),
        ],
      ),
    );
  }

  String _getReservationTypeLabel(ReservationType type) {
    switch (type) {
      case ReservationType.booking:
        return 'Booking';
      case ReservationType.viewing:
        return 'Viewing';
      case ReservationType.maintenance:
        return 'Maintenance';
      case ReservationType.other:
        return 'Other';
    }
  }

  String _getReservationStatusLabel(ReservationStatus status) {
    switch (status) {
      case ReservationStatus.pending:
        return 'Pending';
      case ReservationStatus.confirmed:
        return 'Confirmed';
      case ReservationStatus.cancelled:
        return 'Cancelled';
      case ReservationStatus.completed:
        return 'Completed';
      case ReservationStatus.noShow:
        return 'No Show';
      case ReservationStatus.CANCELLED:
        // TODO: Handle this case.
        throw UnimplementedError();
    }
  }

  IconData _getReservationTypeIcon(ReservationType type) {
    switch (type) {
      case ReservationType.booking:
        return Icons.calendar_today;
      case ReservationType.viewing:
        return Icons.visibility;
      case ReservationType.maintenance:
        return Icons.build;
      case ReservationType.other:
        return Icons.more_horiz;
    }
  }

  Color _getStatusColor(ReservationStatus status) {
    switch (status) {
      case ReservationStatus.pending:
        return Colors.orange;
      case ReservationStatus.confirmed:
        return Colors.green;
      case ReservationStatus.cancelled:
        return Colors.red;
      case ReservationStatus.completed:
        return Colors.blue;
      case ReservationStatus.noShow:
        return Colors.grey;
      case ReservationStatus.CANCELLED:
        // TODO: Handle this case.
        throw UnimplementedError();
    }
  }
}
