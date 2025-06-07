import 'package:flutter/material.dart';

class UpcomingEventsSection extends StatelessWidget {
  const UpcomingEventsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final events = [
      const UpcomingEvent(
          title: 'Lease Renewal - Sarah Johnson', date: 'Apr 25, 2025'),
      const UpcomingEvent(
          title: 'Rent Due - 8 Properties', date: 'May 1, 2025'),
      const UpcomingEvent(title: 'Scheduled Maintenance', date: 'May 3, 2025'),
      const UpcomingEvent(title: 'New Tenant Move-in', date: 'May 5, 2025'),
    ];
    return Column(
      children:
          events.map((event) => _UpcomingEventCard(event: event)).toList(),
    );
  }
}

class UpcomingEvent {
  final String title;
  final String date;
  const UpcomingEvent({required this.title, required this.date});
}

class _UpcomingEventCard extends StatelessWidget {
  final UpcomingEvent event;
  const _UpcomingEventCard({required this.event});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 0),
      child: ListTile(
        title: Text(event.title,
            style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(event.date),
        trailing: ElevatedButton(
          onPressed: () {
            debugPrint('View Details tapped for event: \\${event.title}');
          },
          child: const Text('View Details'),
        ),
      ),
    );
  }
}
