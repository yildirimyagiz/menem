import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/ticket.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse
import 'dart:developer';

/// Custom exception for ticket-related errors.
class TicketException implements Exception {
  final String message;
  TicketException(this.message);
  @override
  String toString() => 'TicketException: $message';
}

/// Service for handling ticket-related API operations via TRPC.
class TicketService {
  final ApiService _apiService;

  TicketService(this._apiService);

  /// Fetches all tickets.
  /// Corresponds to `ticket.all` tRPC procedure.
  Future<PaginatedResponse<Ticket>> getTickets({
    int page = 1,
    int pageSize = 10,
    String? sortBy,
    String sortOrder = 'desc',
    Map<String, dynamic>? filters, // To match TicketFilterSchema
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'pageSize': pageSize,
        'sortOrder': sortOrder,
        if (sortBy != null) 'sortBy': sortBy,
        ...(filters ?? {}),
      };
      final response = await _apiService.query('ticket.all', params);

      return PaginatedResponse<Ticket>.fromJson(
        response as Map<String, dynamic>,
        (json) => Ticket.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e, st) {
      _logError('getTickets', e, st);
      throw TicketException('Failed to get tickets: $e');
    }
  }

  /// Fetches a single ticket by ID.
  /// Corresponds to `ticket.byId` tRPC procedure.
  Future<Ticket?> getTicketById(String id) async {
    try {
      final response = await _apiService.query('ticket.byId', {'id': id});
      if (response == null) {
        return null; // Or throw specific "Not Found" TicketException
      }
      return Ticket.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getTicketById', e, st);
      if (e.toString().contains('NOT_FOUND')) return null;
      throw TicketException('Failed to get ticket: $e');
    }
  }

  /// Creates a new ticket. All fields from the Ticket model (except id, createdAt, updatedAt, deletedAt) should be provided.
  Future<Ticket> createTicket({
    required String title,
    required String description,
    required TicketType type,
    required TicketPriority priority,
    required TicketStatus status,
    required String userId,
    String? assignedTo,
    DateTime? dueDate,
    DateTime? resolvedAt,
    DateTime? closedAt,
    List<String>? attachments,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) async {
    final Map<String, dynamic> data = {
      'title': title,
      'description': description,
      'type': type.name, // Send enum name
      'priority': priority.name,
      'status': status.name,
      'userId': userId,
      if (assignedTo != null) 'assignedTo': assignedTo,
      if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
      if (resolvedAt != null) 'resolvedAt': resolvedAt.toIso8601String(),
      if (closedAt != null) 'closedAt': closedAt.toIso8601String(),
      if (attachments != null) 'attachments': attachments,
      if (metadata != null) 'metadata': metadata,
      if (createdBy != null) 'createdBy': createdBy,
      if (updatedBy != null) 'updatedBy': updatedBy,
    };
    try {
      final response = await _apiService.mutation('ticket.create', data);
      if (response == null) {
        throw TicketException('No data returned from createTicket');
      }
      return Ticket.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createTicket', e, st);
      throw TicketException('Failed to create ticket: $e');
    }
  }

  /// Updates an existing ticket by ID. All updatable fields from the Ticket model can be provided.
  Future<Ticket> updateTicket({
    required String id,
    String? title,
    String? description,
    TicketType? type,
    TicketPriority? priority,
    TicketStatus? status,
    String? userId,
    String? assignedTo,
    DateTime? dueDate,
    DateTime? resolvedAt,
    DateTime? closedAt,
    List<String>? attachments,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) async {
    final Map<String, dynamic> data = {
      'id': id,
      if (title != null) 'title': title,
      if (description != null) 'description': description,
      if (type != null) 'type': type.name,
      if (priority != null) 'priority': priority.name,
      if (status != null) 'status': status.name,
      if (userId != null) 'userId': userId,
      if (assignedTo != null) 'assignedTo': assignedTo,
      if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
      if (resolvedAt != null) 'resolvedAt': resolvedAt.toIso8601String(),
      if (closedAt != null) 'closedAt': closedAt.toIso8601String(),
      if (attachments != null) 'attachments': attachments,
      if (metadata != null) 'metadata': metadata,
      if (createdBy != null) 'createdBy': createdBy,
      if (updatedBy != null) 'updatedBy': updatedBy,
    };
    try {
      final response = await _apiService.mutation('ticket.update', data);
      if (response == null) {
        throw TicketException('No data returned from updateTicket');
      }
      return Ticket.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateTicket', e, st);
      throw TicketException('Failed to update ticket: $e');
    }
  }

  /// Deletes a ticket by ID.
  Future<void> deleteTicket(String id) async {
    try {
      await _apiService.mutation('ticket.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteTicket', e, st);
      throw TicketException('Failed to delete ticket: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[TicketService][$method] $error', error: error, stackTrace: st);
  }
}
