import 'package:flutter/foundation.dart';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/exceptions/api_exception.dart';
import 'package:mobile/models/analytics.dart' show Analytics, AnalyticsType;
import 'package:mobile/models/pagination.dart' show PaginatedResponse;

class AnalyticsService {
  final ApiService _apiService;

  AnalyticsService(this._apiService);

  Future<PaginatedResponse<Analytics>> getAnalytics({
    int page = 1,
    int limit = 10,
    String? entityId,
    String? entityType,
    AnalyticsType? type,
    String? propertyId,
    String? userId,
    String? agentId,
    String? agencyId,
    String? taskId,
    String? reservationId,
    DateTime? timestampFrom,
    DateTime? timestampTo,
    String? sortBy,
    String sortOrder = 'asc',
  }) async {
    try {
      final response = await _apiService.query(
        'analytics.all',
        {
          'page': page,
          'limit': limit,
          if (entityId != null) 'entityId': entityId,
          if (entityType != null) 'entityType': entityType,
          if (type != null)
            'type': type.name, // Assuming type.name is the correct string value
          if (propertyId != null) 'propertyId': propertyId,
          if (userId != null) 'userId': userId,
          if (agentId != null) 'agentId': agentId,
          if (agencyId != null) 'agencyId': agencyId,
          if (taskId != null) 'taskId': taskId,
          if (reservationId != null) 'reservationId': reservationId,
          if (timestampFrom != null)
            'timestampFrom': timestampFrom.toIso8601String(),
          if (timestampTo != null) 'timestampTo': timestampTo.toIso8601String(),
          if (sortBy != null) 'sortBy': sortBy,
          'sortOrder': sortOrder,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from getAnalytics');
      }

      return PaginatedResponse<Analytics>.fromJson(
        response,
        (json) => Analytics.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getAnalytics', e, st);
      throw ApiException.server('Failed to get analytics: $e');
    }
  }

  Future<Analytics> getAnalyticsById(String id) async {
    try {
      final response = await _apiService.query(
        'analytics.byId',
        {'id': id},
      );

      if (response == null) {
        throw ApiException.notFound('Analytics not found');
      }

      return Analytics.fromJson(response);
    } catch (e, st) {
      _logError('getAnalyticsById', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Analytics not found');
      }
      throw ApiException.server('Failed to get analytics: $e');
    }
  }

  Future<Analytics> createAnalytics({
    required String entityId,
    required String entityType,
    required AnalyticsType type,
    required Map<String, dynamic> data,
    DateTime? timestamp,
    String? propertyId,
    String? userId,
    String? agentId,
    String? agencyId,
    String? taskId,
    String? reservationId,
  }) async {
    try {
      final response = await _apiService.mutation(
        'analytics.create',
        {
          'entityId': entityId,
          'entityType': entityType,
          'type': type.name,
          'data': data,
          'timestamp': (timestamp ?? DateTime.now()).toIso8601String(),
          if (propertyId != null) 'propertyId': propertyId,
          if (userId != null) 'userId': userId,
          if (agentId != null) 'agentId': agentId,
          if (agencyId != null) 'agencyId': agencyId,
          if (taskId != null) 'taskId': taskId,
          if (reservationId != null) 'reservationId': reservationId,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from createAnalytics');
      }

      return Analytics.fromJson(response);
    } catch (e, st) {
      _logError('createAnalytics', e, st);
      throw ApiException.server('Failed to create analytics: $e');
    }
  }

  Future<Analytics> updateAnalytics({
    // 'data' parameter removed as individual fields are now preferred for clarity
    required String id,
    String? entityId,
    String? entityType,
    AnalyticsType? type,
    DateTime? timestamp,
    String? propertyId,
    String? userId,
    String? agentId,
    String? agencyId,
    String? taskId,
    String? reservationId,
    Map<String, dynamic>? data,
  }) async {
    try {
      final updateData = <String, dynamic>{
        'id': id,
        if (entityId != null) 'entityId': entityId,
        if (entityType != null) 'entityType': entityType,
        if (type != null) 'type': type.name,
        if (timestamp != null) 'timestamp': timestamp.toIso8601String(),
        if (propertyId != null) 'propertyId': propertyId,
        if (userId != null) 'userId': userId,
        if (agentId != null) 'agentId': agentId,
        if (agencyId != null) 'agencyId': agencyId,
        if (taskId != null) 'taskId': taskId,
        if (reservationId != null) 'reservationId': reservationId,
      };

      final response = await _apiService.mutation(
        'analytics.update',
        updateData,
      );

      if (response == null) {
        throw ApiException.server('No data returned from updateAnalytics');
      }

      return Analytics.fromJson(response);
    } catch (e, st) {
      _logError('updateAnalytics', e, st);
      throw ApiException.server('Failed to update analytics: $e');
    }
  }

  Future<void> deleteAnalytics(String id) async {
    try {
      await _apiService.mutation(
        'analytics.delete',
        {'id': id},
      );
    } catch (e, st) {
      _logError('deleteAnalytics', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ApiException.notFound('Analytics not found');
      }
      throw ApiException.server('Failed to delete analytics: $e');
    }
  }

  Future<List<dynamic>> getMetrics({
    required DateTime startDate,
    required DateTime endDate,
    AnalyticsType? type,
  }) async {
    try {
      final response = await _apiService.query(
        'analytics.metrics',
        {
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
          if (type != null) 'type': type.name,
        },
      );

      if (response == null) {
        throw ApiException.server('No data returned from getMetrics');
      }

      return response is List ? response : [response];
    } catch (e, st) {
      _logError('getMetrics', e, st);
      if (e is ApiException) rethrow;
      throw ApiException.server('Failed to get metrics: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    if (error is ApiException) {
      error.log();
    } else {
      debugPrint('[AnalyticsService][$method] $error');
      debugPrint('Stack Trace:');
      debugPrint(st.toString());
    }
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final response = await _apiService.get('/analytics/dashboard');
      return response.data as Map<String, dynamic>;
    } catch (e, st) {
      _logError('getDashboardStats', e, st);
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getRevenueStats(Map<String, dynamic> params) async {
    try {
      final response = await _apiService.get(
        '/analytics/revenue',
        queryParameters: params,
      );
      return response.data as Map<String, dynamic>;
    } catch (e, st) {
      _logError('getRevenueStats', e, st);
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getAgentStats(String agentId) async {
    try {
      final response = await _apiService.get(
        '/analytics/agent/$agentId',
      );
      return response.data as Map<String, dynamic>;
    } catch (e, st) {
      _logError('getAgentStats', e, st);
      rethrow;
    }
  }
}
