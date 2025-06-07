import 'package:mobile/models/user.dart';
import 'dart:developer';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for user-related errors.
class UserException implements Exception {
  final String message;
  UserException(this.message);
  @override
  String toString() => 'UserException: $message';
}

/// Service for handling user-related API operations via TRPC.
class UserService {
  final ApiService _apiService;

  UserService(this._apiService);

  /// Fetches all users (optionally filtered).
  /// Corresponds to `user.all` tRPC procedure.
  Future<PaginatedResponse<User>> getUsers({
    int page = 1,
    int pageSize = 10,
    String? sortBy,
    String sortOrder = 'desc',
    Map<String, dynamic>? filters, // To match UserFilterSchema
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'pageSize': pageSize,
        'sortOrder': sortOrder,
        if (sortBy != null) 'sortBy': sortBy,
        ...(filters ?? {}),
      };
      final response = await _apiService.query('user.all', params);

      return PaginatedResponse<User>.fromJson(
        response as Map<String, dynamic>,
        (json) => User.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e, st) {
      _logError('getUsers', e, st);
      throw UserException('Failed to get users: $e');
    }
  }

  /// Fetches a single user by ID.
  /// Corresponds to `user.byId` tRPC procedure.
  Future<User?> getUserById(String id) async {
    try {
      final response = await _apiService.query('user.byId', {'id': id});
      if (response == null) {
        return null; // Or throw specific "Not Found" UserException
      }
      return User.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getUserById', e, st);
      if (e.toString().contains('NOT_FOUND')) return null;
      throw UserException('Failed to get user: $e');
    }
  }

  /// Creates a new user. All fields from the User model (except id, createdAt, updatedAt, deletedAt) should be provided.
  Future<User> createUser({
    required String email,
    String? username,
    String? displayName,
    String? name,
    String? firstName,
    String? lastName,
    String? phoneNumber,
    String? profilePicture,
    String? image,
    required Role role,
    required AccountType type,
    required bool isActive,
    DateTime? lastLogin,
    DateTime? emailVerified,
    String? responseTime,
    String? locale,
    String? timezone,
    Map<String, dynamic>? preferences,
    String? agencyId,
    required UserStatus status,
    String? facilityId,
    String? includedServiceId,
    String? extraChargeId,
    String? locationId,
  }) async {
    final Map<String, dynamic> data = {
      'email': email,
      if (username != null) 'username': username,
      if (displayName != null) 'displayName': displayName,
      if (name != null) 'name': name,
      if (firstName != null) 'firstName': firstName,
      if (lastName != null) 'lastName': lastName,
      if (phoneNumber != null) 'phoneNumber': phoneNumber,
      if (profilePicture != null) 'profilePicture': profilePicture,
      if (image != null) 'image': image,
      'role': role.name, // Send enum name
      'type': type.name, // Send enum name
      'isActive': isActive,
      if (lastLogin != null) 'lastLogin': lastLogin.toIso8601String(),
      if (emailVerified != null)
        'emailVerified': emailVerified.toIso8601String(),
      if (responseTime != null)
        'responseTime': responseTime, // Assuming backend handles Date or String
      if (locale != null) 'locale': locale,
      if (timezone != null) 'timezone': timezone,
      if (preferences != null) 'preferences': preferences,
      if (agencyId != null) 'agencyId': agencyId,
      'status': status.name, // Send enum name
      if (facilityId != null) 'facilityId': facilityId,
      if (includedServiceId != null) 'includedServiceId': includedServiceId,
      if (extraChargeId != null) 'extraChargeId': extraChargeId,
      if (locationId != null) 'locationId': locationId,
    };
    try {
      final response = await _apiService.mutation('user.create', data);
      if (response == null) {
        throw UserException('No data returned from createUser');
      }
      return User.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createUser', e, st);
      throw UserException('Failed to create user: $e');
    }
  }

  /// Updates an existing user by ID. All updatable fields from the User model can be provided.
  Future<User> updateUser({
    required String id,
    String? email,
    String? username,
    String? displayName,
    String? name,
    String? firstName,
    String? lastName,
    String? phoneNumber,
    String? profilePicture,
    String? image,
    Role? role,
    AccountType? type,
    bool? isActive,
    DateTime? lastLogin,
    DateTime? emailVerified,
    String? responseTime,
    String? locale,
    String? timezone,
    Map<String, dynamic>? preferences,
    String? agencyId,
    UserStatus? status,
    String? facilityId,
    String? includedServiceId,
    String? extraChargeId,
    String? locationId,
  }) async {
    final Map<String, dynamic> data = {
      'id': id,
      if (email != null) 'email': email,
      if (username != null) 'username': username,
      if (displayName != null) 'displayName': displayName,
      if (name != null) 'name': name,
      if (firstName != null) 'firstName': firstName,
      if (lastName != null) 'lastName': lastName,
      if (phoneNumber != null) 'phoneNumber': phoneNumber,
      if (profilePicture != null) 'profilePicture': profilePicture,
      if (image != null) 'image': image,
      if (role != null) 'role': role.name,
      if (type != null) 'type': type.name,
      if (isActive != null) 'isActive': isActive,
      if (lastLogin != null) 'lastLogin': lastLogin.toIso8601String(),
      if (emailVerified != null)
        'emailVerified': emailVerified.toIso8601String(),
      if (responseTime != null) 'responseTime': responseTime,
      if (locale != null) 'locale': locale,
      if (timezone != null) 'timezone': timezone,
      if (preferences != null) 'preferences': preferences,
      if (agencyId != null) 'agencyId': agencyId,
      if (status != null) 'status': status.name,
      if (facilityId != null) 'facilityId': facilityId,
      if (includedServiceId != null) 'includedServiceId': includedServiceId,
      if (extraChargeId != null) 'extraChargeId': extraChargeId,
      if (locationId != null) 'locationId': locationId,
    };
    try {
      final response = await _apiService.mutation('user.update', data);
      if (response == null) {
        throw UserException('No data returned from updateUser');
      }
      return User.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateUser', e, st);
      throw UserException('Failed to update user: $e');
    }
  }

  /// Deletes a user by ID.
  /// Corresponds to `user.delete` tRPC procedure.
  Future<void> deleteUser(String id) async {
    try {
      await _apiService.mutation('user.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteUser', e, st);
      throw UserException('Failed to delete user: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[UserService][$method] $error', error: error, stackTrace: st);
  }
}
