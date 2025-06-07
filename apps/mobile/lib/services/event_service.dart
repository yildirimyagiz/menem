import 'package:flutter/foundation.dart';

import '../api/api_service.dart';
import '../models/event.dart';
import 'dart:developer';
import '../models/pagination.dart'; // For PaginatedResponse

/// Custom exception for event-related errors.
class EventException implements Exception {
  final String message;
  final String? code;

  EventException(this.message, {this.code});

  /// Creates a "not found" event exception.
  factory EventException.notFound(String message) =>
      EventException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'EventException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling event-related API operations via TRPC.
class EventService {
  final ApiService _apiService;

  EventService(this._apiService);

  /// Fetches all events (optionally filtered).
  Future<PaginatedResponse<Event>> getEvents({
    int page = 1,
    int limit = 10, // Corresponds to pageSize in EventFilterSchema
    String? propertyId,
    EventType? eventType, // Assuming EventType enum exists in models/event.dart
    String? createdById,
    DateTime? scheduledAtFrom,
    DateTime? scheduledAtTo,
    bool? isActive,
    DateTime? deletedAt,
    String? sortBy, // e.g., "scheduledAt", "createdAt", "updatedAt"
    String sortOrder = 'desc', // "asc" or "desc"
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'pageSize': limit, // Schema uses pageSize
        'sortOrder': sortOrder,
      };
      if (propertyId != null) params['propertyId'] = propertyId;
      if (eventType != null) {
        params['eventType'] = eventType.name; // Assuming enum.name
      }
      if (createdById != null) params['createdById'] = createdById;
      if (scheduledAtFrom != null) {
        params['scheduledAtFrom'] = scheduledAtFrom.toIso8601String();
      }
      if (scheduledAtTo != null) {
        params['scheduledAtTo'] = scheduledAtTo.toIso8601String();
      }
      if (isActive != null) params['isActive'] = isActive;
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'event.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw EventException('No data returned from getEvents');
      }
      return PaginatedResponse<Event>.fromJson(
        response,
        (json) => Event.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getEvents', e, st);
      throw EventException('Failed to get events: $e');
    }
  }

  /// Fetches a single event by ID.
  Future<Event> getEvent(String id) async {
    try {
      final response = await _apiService.query(
        'event.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw EventException.notFound(
            'Event not found with ID: $id. No data returned.');
      }
      return Event.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getEvent', e, st);
      if (e is EventException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw EventException.notFound('Event not found with ID: $id.');
      }
      throw EventException('Failed to get event: $e');
    }
  }

  /// Fetches events for a specific property.
  Future<List<Event>> getEventsByProperty(String propertyId) async {
    try {
      final response = await _apiService.query(
        'event.byProperty',
        {'propertyId': propertyId},
      );
      if (response == null || response['events'] == null) {
        throw EventException(
            'No data returned from getEventsByProperty for property ID: $propertyId');
      }
      if (response['events'] is List) {
        return (response['events'] as List)
            .map((json) => Event.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      throw EventException(
          'Unexpected response format from getEventsByProperty.');
    } catch (e, st) {
      _logError('getEventsByProperty', e, st);
      throw EventException('Failed to get events by property: $e');
    }
  }

  /// Creates a new event.
  Future<Event> createEvent({
    // Parameters based on CreateEventSchema
    required String propertyId,
    required String title,
    required DateTime scheduledAt,
    String? description,
    EventType? eventType,
    int? duration, // in minutes
    String? createdById,
    List<String>? attendees, // user IDs
    bool? isActive,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'propertyId': propertyId,
        'title': title,
        'scheduledAt': scheduledAt.toIso8601String(),
      };
      if (description != null) params['description'] = description;
      if (eventType != null) params['eventType'] = eventType.name;
      if (duration != null) params['duration'] = duration;
      if (createdById != null) params['createdById'] = createdById;
      if (attendees != null) params['attendees'] = attendees;
      if (isActive != null) params['isActive'] = isActive;

      final response = await _apiService.mutation(
        'event.create',
        params,
      );
      if (response == null) {
        throw EventException('No data returned from createEvent');
      }
      return Event.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createEvent', e, st);
      throw EventException('Failed to create event: $e');
    }
  }

  /// Updates an existing event by ID.
  Future<Event> updateEvent({
    // Parameters based on UpdateEventSchema
    required String id,
    String? title,
    String? description,
    EventType? eventType,
    DateTime? scheduledAt,
    int? duration,
    List<String>? attendees,
    bool? isActive,
    DateTime? deletedAt, // For soft delete, if applicable
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (title != null) params['title'] = title;
      if (description != null) params['description'] = description;
      if (eventType != null) params['eventType'] = eventType.name;
      if (scheduledAt != null) {
        params['scheduledAt'] = scheduledAt.toIso8601String();
      }
      if (duration != null) params['duration'] = duration;
      if (attendees != null) params['attendees'] = attendees;
      if (isActive != null) params['isActive'] = isActive;
      if (deletedAt != null) params['deletedAt'] = deletedAt.toIso8601String();

      final response = await _apiService.mutation(
        'event.update',
        params,
      );
      if (response == null) {
        throw EventException('No data returned from updateEvent');
      }
      return Event.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateEvent', e, st);
      if (e is EventException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw EventException.notFound(
            'Event not found for update with ID: $id.');
      }
      throw EventException('Failed to update event: $e');
    }
  }

  /// Deletes an event by ID.
  Future<void> deleteEvent(String id) async {
    try {
      await _apiService.mutation('event.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteEvent', e, st);
      if (e is EventException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw EventException.notFound(
            'Event not found or already deleted with ID: $id.');
      }
      // For other errors, wrap them
      throw EventException('Failed to delete event: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[EventService][$method] $error', error: error, stackTrace: st);
    // Optionally log errors to a logging service or console
    if (kDebugMode) {
      print('EventService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }
}
