import 'package:mobile/models/task.dart';
import 'dart:developer';
import 'package:mobile/api/api_service.dart';

/// Custom exception for task-related errors.
class TaskException implements Exception {
  final String message;
  TaskException(this.message);
  @override
  String toString() => 'TaskException: $message';
}

/// Service for handling task-related API operations via TRPC.
class TaskService {
  final ApiService _apiService;

  TaskService(this._apiService);

  /// Fetches all tasks.
  Future<List<Task>> getTasks() async {
    try {
      final response = await _apiService.query(
        'task.getAll',
        {},
      );
      if (response == null) {
        throw TaskException('No data returned from getTasks');
      }
      return (response as List).map((json) => Task.fromJson(json)).toList();
    } catch (e, st) {
      _logError('getTasks', e, st);
      throw TaskException('Failed to get tasks: $e');
    }
  }

  /// Fetches a single task by ID.
  Future<Task> getTask(String id) async {
    try {
      final response = await _apiService.query(
        'task.get',
        {'id': id},
      );
      if (response == null) {
        throw TaskException('No data returned from getTask');
      }
      return Task.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getTask', e, st);
      throw TaskException('Failed to get task: $e');
    }
  }

  /// Creates a new task. All fields from the Task model (except id, createdAt, updatedAt, deletedAt, and relation objects) should be provided.
  Future<Task> createTask({
    required String title,
    String? description,
    TaskStatus status = TaskStatus.todo,
    required TaskType type,
    TaskPriority priority = TaskPriority.medium,
    String? createdById,
    String? assignedToId,
    String? propertyId,
    String? agentId,
    String? agencyId,
    DateTime? dueDate,
    DateTime? completedAt,
    String? facilityId,
    String? includedServiceId,
    String? extraChargeId,
  }) async {
    try {
      final response = await _apiService.mutation(
        'task.create',
        {
          'title': title,
          if (description != null) 'description': description,
          'status': status.toString().split('.').last,
          'type': type.toString().split('.').last,
          'priority': priority.toString().split('.').last,
          if (createdById != null) 'createdById': createdById,
          if (assignedToId != null) 'assignedToId': assignedToId,
          if (propertyId != null) 'propertyId': propertyId,
          if (agentId != null) 'agentId': agentId,
          if (agencyId != null) 'agencyId': agencyId,
          if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
          if (completedAt != null) 'completedAt': completedAt.toIso8601String(),
          if (facilityId != null) 'facilityId': facilityId,
          if (includedServiceId != null) 'includedServiceId': includedServiceId,
          if (extraChargeId != null) 'extraChargeId': extraChargeId,
        },
      );
      if (response == null) {
        throw TaskException('No data returned from createTask');
      }
      return Task.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createTask', e, st);
      throw TaskException('Failed to create task: $e');
    }
  }

  /// Updates an existing task by ID. All updatable fields from the Task model can be provided (except relation objects).
  Future<Task> updateTask({
    required String id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskType? type,
    TaskPriority? priority,
    String? createdById,
    String? assignedToId,
    String? propertyId,
    String? agentId,
    String? agencyId,
    DateTime? dueDate,
    DateTime? completedAt,
    String? facilityId,
    String? includedServiceId,
    String? extraChargeId,
  }) async {
    try {
      final response = await _apiService.mutation(
        'task.update',
        {
          'id': id,
          if (title != null) 'title': title,
          if (description != null) 'description': description,
          if (status != null) 'status': status.toString().split('.').last,
          if (type != null) 'type': type.toString().split('.').last,
          if (priority != null) 'priority': priority.toString().split('.').last,
          if (createdById != null) 'createdById': createdById,
          if (assignedToId != null) 'assignedToId': assignedToId,
          if (propertyId != null) 'propertyId': propertyId,
          if (agentId != null) 'agentId': agentId,
          if (agencyId != null) 'agencyId': agencyId,
          if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
          if (completedAt != null) 'completedAt': completedAt.toIso8601String(),
          if (facilityId != null) 'facilityId': facilityId,
          if (includedServiceId != null) 'includedServiceId': includedServiceId,
          if (extraChargeId != null) 'extraChargeId': extraChargeId,
        },
      );
      if (response == null) {
        throw TaskException('No data returned from updateTask');
      }
      return Task.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateTask', e, st);
      throw TaskException('Failed to update task: $e');
    }
  }

  /// Deletes a task by ID.
  Future<void> deleteTask(String id) async {
    try {
      await _apiService.mutation('task.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteTask', e, st);
      throw TaskException('Failed to delete task: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[TaskService][$method] $error', error: error, stackTrace: st);
  }
}
