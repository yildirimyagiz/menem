import 'package:flutter/material.dart';
import '../../models/event.dart';
import 'package:intl/intl.dart';

class EventCard extends StatelessWidget {
  final Event event;
  final VoidCallback? onTap;
  const EventCard({super.key, required this.event, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.event),
        title: Text(event.title),
        subtitle: Text(
            '${event.eventType.toString().split('.').last} • ${DateFormat.yMMMd().format(event.scheduledAt)}'),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Chip(
              label: Text(event.status.toString().split('.').last),
              backgroundColor: _statusColor(event.status),
            ),
            Text(DateFormat.Hm().format(event.scheduledAt)),
          ],
        ),
      ),
    );
  }

  Color _statusColor(EventStatus status) {
    switch (status) {
      case EventStatus.scheduled:
        return Colors.blue.shade100;
      case EventStatus.inProgress:
        return Colors.orange.shade100;
      case EventStatus.completed:
        return Colors.green.shade100;
      case EventStatus.cancelled:
        return Colors.grey.shade300;
      case EventStatus.failed:
        return Colors.red.shade100;
    }
  }
}
