import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/pagination.dart';
import 'package:mobile/models/permission.dart';

/// Service for handling permission-related API operations.
class PermissionService {
  final ApiService _apiService;

  PermissionService(this._apiService);

  /// Fetches all permissions with optional filtering and pagination.
  Future<PaginatedResponse<Permission>> getPermissions({
    int page = 1,
    int limit = 10,
    String? userId,
    String? resourceId,
    String? type,
    String? scope,
  }) async {
    try {
      final params = {
        'page': page,
        'limit': limit,
        if (userId != null) 'userId': userId,
        if (resourceId != null) 'resourceId': resourceId,
        if (type != null) 'type': type,
        if (scope != null) 'scope': scope,
      };

      final response = await _apiService.query('permission.all', params);
      
      return PaginatedResponse<Permission>.fromJson(
        response as Map<String, dynamic>,
        (json) => Permission.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e) {
      throw Exception('Failed to fetch permissions: $e');
    }
  }

  /// Fetches a single permission by ID.
  Future<Permission?> getPermission(String id) async {
    try {
      final response = await _apiService.query('permission.byId', {'id': id});
      if (response == null) return null;
      return Permission.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      if (e.toString().contains('not found')) return null;
      rethrow;
    }
  }

  /// Fetches permissions for a specific user.
  Future<PaginatedResponse<Permission>> getPermissionsByUser(String userId) async {
    return getPermissions(userId: userId);
  }

  /// Creates a new permission.
  Future<Permission> createPermission(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation('permission.create', data);
      return Permission.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Failed to create permission: $e');
    }
  }

  /// Updates an existing permission.
  Future<Permission> updatePermission(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation(
        'permission.update',
        {'id': id, ...data},
      );
      return Permission.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Failed to update permission: $e');
    }
  }

  /// Deletes a permission.
  Future<void> deletePermission(String id) async {
    try {
      await _apiService.mutation('permission.delete', {'id': id});
    } catch (e) {
      throw Exception('Failed to delete permission: $e');
    }
  }
}