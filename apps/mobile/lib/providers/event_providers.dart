import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/event.dart';
import '../services/event_service.dart';
import 'api_providers.dart';

part 'event_providers.g.dart';

@riverpod
// ignore: deprecated_member_use_from_same_package
EventService eventService(EventServiceRef ref) {
  return EventService(ref.watch(apiServiceProvider));
}

@riverpod
class EventNotifier extends _$EventNotifier {
  @override
  FutureOr<List<Event>> build() async {
    final response = await ref.read(eventServiceProvider).getEvents();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(eventServiceProvider).getEvents();
      return response.data;
    });
  }

  Future<void> search(String query) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(eventServiceProvider).getEvents();
      // Filter events by query
      if (query.isEmpty) return response.data;
      return response.data
          .where((event) =>
              event.title.toLowerCase().contains(query.toLowerCase()) ||
              (event.description?.toLowerCase().contains(query.toLowerCase()) ??
                  false))
          .toList();
    });
  }

  Future<void> getByType(String type) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(eventServiceProvider).getEvents(
            eventType: EventType.values.firstWhere(
              (e) =>
                  e.toString().split('.').last.toLowerCase() ==
                  type.toLowerCase(),
              orElse: () => EventType.other,
            ),
          );
      return response.data;
    });
  }

  Future<void> getByStatus(String status) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // Convert status string to EventStatus enum
      final eventStatus = EventStatus.values.firstWhere(
        (e) =>
            e.toString().split('.').last.toLowerCase() == status.toLowerCase(),
        orElse: () => throw Exception('Invalid status: $status'),
      );

      // Get all events and filter by status on the client side
      // since the API doesn't support direct status filtering
      final response = await ref.read(eventServiceProvider).getEvents();
      return response.data.where((e) => e.status == eventStatus).toList();
    });
  }

  Future<void> getUpcoming() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final now = DateTime.now();
      final response = await ref.read(eventServiceProvider).getEvents(
            scheduledAtFrom: now,
            sortBy: 'scheduledAt',
            sortOrder: 'asc',
          );
      return response.data;
    });
  }

  Future<void> getByDateRange(DateTime start, DateTime end) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(eventServiceProvider).getEvents(
            scheduledAtFrom: start,
            scheduledAtTo: end,
            sortBy: 'scheduledAt',
            sortOrder: 'asc',
          );
      return response.data;
    });
  }

  Future<void> updateStatus(String id, String status) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final event = await ref.read(eventServiceProvider).getEvent(id);
      final eventStatus = EventStatus.values.firstWhere(
        (e) =>
            e.toString().split('.').last.toLowerCase() == status.toLowerCase(),
        orElse: () => throw Exception('Invalid status: $status'),
      );

      // For cancelled status, we might want to set isActive to false
      final isActive = eventStatus != EventStatus.cancelled &&
          eventStatus != EventStatus.completed &&
          eventStatus != EventStatus.failed;

      final updatedEvent = await ref.read(eventServiceProvider).updateEvent(
            id: id,
            isActive: isActive,
            title: event.title,
            description: event.description,
            scheduledAt: event.scheduledAt,
            eventType: event.eventType,
            duration: event.duration,
            attendees: event.attendees.map((a) => a.id).toList(),
          );

      // Update the list with the updated event
      final currentList = state.valueOrNull ?? [];
      return currentList.map((e) => e.id == id ? updatedEvent : e).toList();
    });
  }
}

@riverpod
class EventDetailNotifier extends _$EventDetailNotifier {
  @override
  FutureOr<Event?> build(String id) async {
    if (id.isEmpty) return null;
    try {
      return await ref.read(eventServiceProvider).getEvent(id);
    } catch (e) {
      debugPrint('Error fetching event details: $e');
      rethrow;
    }
  }

  Future<void> refresh() async {
    final id = state.value?.id;
    if (id == null) return;

    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
        () => ref.read(eventServiceProvider).getEvent(id));
  }

  Future<void> updateStatus(String status) async {
    final currentEvent = state.value;
    if (currentEvent == null) return;

    final eventStatus = EventStatus.values.firstWhere(
      (e) => e.toString().split('.').last.toLowerCase() == status.toLowerCase(),
      orElse: () => throw Exception('Invalid status: $status'),
    );

    // For cancelled status, we might want to set isActive to false
    final isActive = eventStatus != EventStatus.cancelled &&
        eventStatus != EventStatus.completed &&
        eventStatus != EventStatus.failed;

    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      return ref.read(eventServiceProvider).updateEvent(
            id: currentEvent.id,
            isActive: isActive,
            title: currentEvent.title,
            description: currentEvent.description,
            scheduledAt: currentEvent.scheduledAt,
            eventType: currentEvent.eventType,
            duration: currentEvent.duration,
            attendees: currentEvent.attendees.map((a) => a.id).toList(),
          );
    });
  }
}
