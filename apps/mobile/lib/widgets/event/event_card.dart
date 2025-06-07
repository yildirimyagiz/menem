import 'package:flutter/material.dart';
import '../../models/event.dart';
import 'event_details.dart';

class EventCard extends StatelessWidget {
  final Event event;
  final VoidCallback? onTap;

  const EventCard({super.key, required this.event, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: EventDetails(event: event),
        ),
      ),
    );
  }
}
