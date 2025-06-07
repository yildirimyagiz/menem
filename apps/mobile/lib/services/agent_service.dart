import 'package:flutter/foundation.dart';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/exceptions/api_exception.dart';
import 'package:mobile/models/agent.dart';
import 'package:mobile/models/pagination.dart';

class AgentService {
  final ApiService _apiService;

  AgentService(this._apiService);

  Future<PaginatedResponse<Agent>> getAgents({
    int page = 1,
    int limit = 10,
    String? search,
    String? agencyId,
    bool hasDeleted = false,
    DateTime? createdFrom,
    DateTime? createdTo,
    String? sortBy,
    String sortOrder = 'asc',
  }) async {
    try {
      final response = await _apiService.query(
        'agent.all',
        {
          'page': page,
          'limit': limit,
          if (search != null) 'search': search,
          if (agencyId != null) 'agencyId': agencyId,
          'hasDeleted': hasDeleted,
          if (createdFrom != null) 'createdFrom': createdFrom.toIso8601String(),
          if (createdTo != null) 'createdTo': createdTo.toIso8601String(),
          if (sortBy != null) 'sortBy': sortBy,
          'sortOrder': sortOrder,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from getAgents');
      }

      return PaginatedResponse<Agent>.fromJson(
        response,
        (json) => Agent.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getAgents', e, st);
      if (e is ApiException) rethrow;
      throw ApiException.server('Failed to get agents: $e');
    }
  }

  Future<Agent> getAgent(String id) async {
    try {
      final response = await _apiService.query(
        'agent.byId',
        {'id': id},
      );

      if (response == null) {
        throw ApiException.notFound('Agent not found');
      }

      return Agent.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getAgent', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Agent not found');
      }
      throw ApiException.server('Failed to get agent: $e');
    }
  }

  Future<Agent> createAgent({
    required String name,
    String? email,
    String? phone,
    String? agencyId,
  }) async {
    try {
      final response = await _apiService.mutation(
        'agent.create',
        {
          'name': name,
          'email': email,
          'phone': phone,
          'agencyId': agencyId,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from createAgent');
      }

      return Agent.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createAgent', e, st);
      if (e is ApiException) rethrow;
      throw ApiException.server('Failed to create agent: $e');
    }
  }

  Future<Agent> updateAgent({
    required String id,
    String? name,
    String? email,
    String? phone,
    String? agencyId,
  }) async {
    try {
      final response = await _apiService.mutation(
        'agent.update',
        {
          'id': id,
          'name': name,
          'email': email,
          'phone': phone,
          'agencyId': agencyId,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from updateAgent');
      }

      return Agent.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateAgent', e, st);
      throw ApiException.server('Failed to update agent: $e');
    }
  }

  Future<Agent> deleteAgent(String id) async {
    try {
      final response = await _apiService.mutation(
        'agent.delete',
        {'id': id},
      );

      if (response == null) {
        throw ApiException.notFound('Agent not found or already deleted');
      }

      return Agent.fromJson(response);
    } catch (e, st) {
      _logError('deleteAgent', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Agent not found or already deleted');
      }
      throw ApiException.server('Failed to delete agent: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    if (error is ApiException) {
      error.log();
    } else {
      if (kDebugMode) {
        print('[AgentService][$method] $error');
      }
      if (kDebugMode) {
        print('Stack Trace:');
      }
      if (kDebugMode) {
        print(st);
      }
    }
  }
}
