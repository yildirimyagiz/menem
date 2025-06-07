import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../models/event.dart';

class PropertyViewingEvent extends ConsumerWidget {
  final Event event;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onAttend;

  const PropertyViewingEvent({
    super.key,
    required this.event,
    this.onEdit,
    this.onDelete,
    this.onAttend,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('MMM d, y');
    final timeFormat = DateFormat('h:mm a');

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  _getEventTypeIcon(event.eventType),
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    event.title,
                    style: theme.textTheme.titleLarge,
                  ),
                ),
                if (onEdit != null || onDelete != null)
                  PopupMenuButton<String>(
                    onSelected: (value) {
                      switch (value) {
                        case 'edit':
                          onEdit?.call();
                          break;
                        case 'delete':
                          onDelete?.call();
                          break;
                      }
                    },
                    itemBuilder: (context) => [
                      if (onEdit != null)
                        const PopupMenuItem(
                          value: 'edit',
                          child: Row(
                            children: [
                              Icon(Icons.edit),
                              SizedBox(width: 8),
                              Text('Edit'),
                            ],
                          ),
                        ),
                      if (onDelete != null)
                        const PopupMenuItem(
                          value: 'delete',
                          child: Row(
                            children: [
                              Icon(Icons.delete),
                              SizedBox(width: 8),
                              Text('Delete'),
                            ],
                          ),
                        ),
                    ],
                  ),
              ],
            ),
            if (event.description != null) ...[
              const SizedBox(height: 8),
              Text(
                event.description!,
                style: theme.textTheme.bodyMedium,
              ),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16),
                const SizedBox(width: 8),
                Text(
                  dateFormat.format(event.scheduledAt),
                  style: theme.textTheme.bodyMedium,
                ),
                const SizedBox(width: 16),
                const Icon(Icons.access_time, size: 16),
                const SizedBox(width: 8),
                Text(
                  timeFormat.format(event.scheduledAt),
                  style: theme.textTheme.bodyMedium,
                ),
                if (event.duration != null) ...[
                  const SizedBox(width: 8),
                  Text(
                    '(${event.duration} min)',
                    style: theme.textTheme.bodyMedium,
                  ),
                ],
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.people, size: 16),
                const SizedBox(width: 8),
                Text(
                  '${event.attendees.length} ${event.attendees.length == 1 ? 'attendee' : 'attendees'}',
                  style: theme.textTheme.bodyMedium,
                ),
                const Spacer(),
                if (onAttend != null)
                  FilledButton.icon(
                    onPressed: onAttend,
                    icon: const Icon(Icons.add),
                    label: const Text('Attend'),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  IconData _getEventTypeIcon(EventType type) {
    switch (type) {
      case EventType.viewing:
        return Icons.visibility;
      case EventType.openHouse:
        return Icons.home;
      case EventType.maintenance:
        return Icons.build;
      case EventType.inspection:
        return Icons.search;
      case EventType.other:
        return Icons.event;
    }
  }
}

class PropertyViewingEventList extends ConsumerWidget {
  final List<Event> events;
  final VoidCallback? onAddEvent;
  final Function(Event)? onEditEvent;
  final Function(Event)? onDeleteEvent;
  final Function(Event)? onAttendEvent;

  const PropertyViewingEventList({
    super.key,
    required this.events,
    this.onAddEvent,
    this.onEditEvent,
    this.onDeleteEvent,
    this.onAttendEvent,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Text(
                'Viewing Events',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const Spacer(),
              if (onAddEvent != null)
                FilledButton.icon(
                  onPressed: onAddEvent,
                  icon: const Icon(Icons.add),
                  label: const Text('Schedule Viewing'),
                ),
            ],
          ),
        ),
        if (events.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                children: [
                  Icon(
                    Icons.event_busy,
                    size: 48,
                    color: Theme.of(context).colorScheme.outline,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No viewing events scheduled',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Theme.of(context).colorScheme.outline,
                        ),
                  ),
                  if (onAddEvent != null) ...[
                    const SizedBox(height: 16),
                    FilledButton.icon(
                      onPressed: onAddEvent,
                      icon: const Icon(Icons.add),
                      label: const Text('Schedule First Viewing'),
                    ),
                  ],
                ],
              ),
            ),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: events.length,
            itemBuilder: (context, index) {
              final event = events[index];
              return PropertyViewingEvent(
                event: event,
                onEdit: onEditEvent != null ? () => onEditEvent!(event) : null,
                onDelete:
                    onDeleteEvent != null ? () => onDeleteEvent!(event) : null,
                onAttend:
                    onAttendEvent != null ? () => onAttendEvent!(event) : null,
              );
            },
          ),
      ],
    );
  }
}
