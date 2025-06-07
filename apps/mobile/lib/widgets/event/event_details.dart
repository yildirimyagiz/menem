import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/event.dart';

class EventDetails extends StatelessWidget {
  final Event event;
  const EventDetails({super.key, required this.event});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Event Details', style: Theme.of(context).textTheme.titleLarge),
          _buildDetailItem('ID', event.id),
          _buildDetailItem('Title', event.title),
          _buildDetailItem('Description', event.description),
          _buildDetailItem('Type', event.eventType.name),
          _buildDetailItem('Status', event.status.name),
          _buildDetailItem('Property ID', event.propertyId),
          _buildDetailItem('Location', event.location),
          _buildDetailItem('Scheduled At', yMMMdJmFormatter.format(event.scheduledAt)),
          _buildDetailItem('Start Time', yMMMdJmFormatter.format(event.startTime)),
          _buildDetailItem('End Time', yMMMdJmFormatter.format(event.endTime)),
          _buildDetailItem('Duration (min)', event.duration?.toString()),
          _buildDetailItem('Created By', event.createdById),
          _buildDetailItem('Agency ID', event.agencyId),
          _buildDetailItem('User ID', event.userId),
          _buildDetailItem('Is Active', event.isActive ? 'Yes' : 'No'),
          _buildDetailItem('Updated By', event.updatedBy),
          _buildDetailItem('Created At', event.createdAt != null ? yMMMdJmFormatter.format(event.createdAt!) : ''),
          _buildDetailItem('Updated At', event.updatedAt != null ? yMMMdJmFormatter.format(event.updatedAt!) : ''),
          if (event.deletedAt != null)
            _buildDetailItem('Deleted At', yMMMdFormatter.format(event.deletedAt!)),
          if (event.attendees.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text('Attendees:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(event.attendees.map((u) => u.id).join(', ')),
          ],
          if (event.metadata != null) ...[
            const SizedBox(height: 8),
            Text('Metadata:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(event.metadata.toString()),
          ],
        ],
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
              width: 140,
              child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
