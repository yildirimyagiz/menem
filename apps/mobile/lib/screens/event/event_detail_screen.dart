import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/event.dart';

class EventDetailScreen extends StatelessWidget {
  final Event event;
  const EventDetailScreen({super.key, required this.event});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(event.title),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoCard(context, event),
            const SizedBox(height: 16),
            _buildMetadataCard(context, event),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(BuildContext context, Event event) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Event Information',
                style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            _buildInfoRow('Type', event.eventType.toString().split('.').last),
            _buildInfoRow('Status', event.status.toString().split('.').last),
            _buildInfoRow('Scheduled At',
                DateFormat.yMMMd().add_jm().format(event.scheduledAt)),
            _buildInfoRow('Duration', event.duration?.toString() ?? '-'),
            _buildInfoRow('Location', event.location ?? '-'),
            _buildInfoRow(
                'Attendees',
                event.attendees.map((a) => a.name).join(', ').isNotEmpty
                    ? event.attendees.map((a) => a.name).join(', ')
                    : '-'),
            _buildInfoRow('Property', event.property.name ?? '-'),
            _buildInfoRow('Created By', event.createdBy?.name ?? '-'),
            _buildInfoRow('Is Active', event.isActive ? 'Yes' : 'No'),
            _buildInfoRow('Start Time',
                DateFormat.yMMMd().add_jm().format(event.startTime)),
            _buildInfoRow(
                'End Time', DateFormat.yMMMd().add_jm().format(event.endTime)),
          ],
        ),
      ),
    );
  }

  Widget _buildMetadataCard(BuildContext context, Event event) {
    if (event.metadata == null) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Metadata', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            SelectableText(event.metadata.toString()),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          Flexible(child: Text(value, overflow: TextOverflow.ellipsis)),
        ],
      ),
    );
  }
}
