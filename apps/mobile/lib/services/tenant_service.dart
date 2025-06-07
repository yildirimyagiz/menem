import 'package:mobile/models/tenant.dart';
import 'dart:developer';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for tenant-related errors.
class TenantException implements Exception {
  final String message;
  TenantException(this.message);
  @override
  String toString() => 'TenantException: $message';
}

/// Service for handling tenant-related API operations via TRPC.
class TenantService {
  final ApiService _apiService;

  TenantService(this._apiService);

  /// Fetches all tenants.
  /// Corresponds to `tenant.all` tRPC procedure.
  Future<PaginatedResponse<Tenant>> getTenants({
    int page = 1,
    int pageSize = 10,
    String? sortBy, // Matches backend, e.g., 'createdAt'
    String sortOrder = 'desc',
    Map<String, dynamic>? filters, // To match TenantFilterSchema
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'pageSize': pageSize,
        'sortOrder': sortOrder,
        if (sortBy != null) 'sortBy': sortBy,
        ...(filters ?? {}),
      };
      final response = await _apiService.query('tenant.all', params);

      return PaginatedResponse<Tenant>.fromJson(
        response as Map<String, dynamic>,
        (json) => Tenant.fromJson(json as Map<String, dynamic>),
        dataKey: 'data', // Backend returns { data: [...], pagination: {...} }
      );
    } catch (e, st) {
      _logError('getTenants', e, st);
      throw TenantException('Failed to get tenants: $e');
    }
  }

  /// Fetches a single tenant by ID.
  /// Corresponds to `tenant.byId` tRPC procedure.
  Future<Tenant?> getTenantById(String id) async {
    try {
      final response = await _apiService.query('tenant.byId', {'id': id});
      if (response == null) {
        return null; // Or throw specific "Not Found" TenantException
      }
      return Tenant.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getTenantById', e, st);
      if (e.toString().contains('NOT_FOUND')) return null;
      throw TenantException('Failed to get tenant: $e');
    }
  }

  /// Creates a new tenant. All fields from the Tenant model (except id, createdAt, updatedAt, deletedAt) should be provided.
  Future<Tenant> createTenant({
    required String userId,
    required String firstName,
    required String lastName,
    required String email,
    String? phoneNumber,
    required DateTime leaseStartDate,
    required DateTime leaseEndDate,
    required PaymentStatus paymentStatus,
    required String propertyId,
    TenantStatus status = TenantStatus.active,
    List<String>? documentIds,
    Map<String, dynamic>? metadata,
    String? notes,
    String? emergencyContact,
    String? emergencyPhone,
    double? securityDeposit,
    String? currency,
    DateTime? lastPaymentDate,
    double? balance,
  }) async {
    final Map<String, dynamic> data = {
      'userId': userId,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      if (phoneNumber != null) 'phoneNumber': phoneNumber,
      'leaseStartDate': leaseStartDate.toIso8601String(),
      'leaseEndDate': leaseEndDate.toIso8601String(),
      'paymentStatus': paymentStatus.name, // Send enum name
      'propertyId': propertyId,
      'status': status.name, // Send enum name
      if (documentIds != null) 'documentIds': documentIds,
      if (metadata != null) 'metadata': metadata,
      if (notes != null) 'notes': notes,
      if (emergencyContact != null) 'emergencyContact': emergencyContact,
      if (emergencyPhone != null) 'emergencyPhone': emergencyPhone,
      if (securityDeposit != null) 'securityDeposit': securityDeposit,
      if (currency != null) 'currency': currency,
      if (lastPaymentDate != null)
        'lastPaymentDate': lastPaymentDate.toIso8601String(),
      if (balance != null) 'balance': balance,
    };
    try {
      final response = await _apiService.mutation('tenant.create', data);
      if (response == null) {
        throw TenantException('No data returned from createTenant');
      }
      return Tenant.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createTenant', e, st);
      throw TenantException('Failed to create tenant: $e');
    }
  }

  /// Updates an existing tenant by ID. All updatable fields from the Tenant model can be provided.
  Future<Tenant> updateTenant({
    required String id,
    String? userId,
    String? firstName,
    String? lastName,
    String? email,
    String? phoneNumber,
    DateTime? leaseStartDate,
    DateTime? leaseEndDate,
    PaymentStatus? paymentStatus,
    String? propertyId,
    TenantStatus? status,
    List<String>? documentIds,
    Map<String, dynamic>? metadata,
    String? notes,
    String? emergencyContact,
    String? emergencyPhone,
    double? securityDeposit,
    String? currency,
    DateTime? lastPaymentDate,
    double? balance,
  }) async {
    final Map<String, dynamic> data = {
      'id': id,
      if (userId != null) 'userId': userId,
      if (firstName != null) 'firstName': firstName,
      if (lastName != null) 'lastName': lastName,
      if (email != null) 'email': email,
      if (phoneNumber != null) 'phoneNumber': phoneNumber,
      if (leaseStartDate != null)
        'leaseStartDate': leaseStartDate.toIso8601String(),
      if (leaseEndDate != null) 'leaseEndDate': leaseEndDate.toIso8601String(),
      if (paymentStatus != null) 'paymentStatus': paymentStatus.name,
      if (propertyId != null) 'propertyId': propertyId,
      if (status != null) 'status': status.name,
      if (documentIds != null) 'documentIds': documentIds,
      if (metadata != null) 'metadata': metadata,
      if (notes != null) 'notes': notes,
      if (emergencyContact != null) 'emergencyContact': emergencyContact,
      if (emergencyPhone != null) 'emergencyPhone': emergencyPhone,
      if (securityDeposit != null) 'securityDeposit': securityDeposit,
      if (currency != null) 'currency': currency,
      if (lastPaymentDate != null)
        'lastPaymentDate': lastPaymentDate.toIso8601String(),
      if (balance != null) 'balance': balance,
    };
    try {
      final response = await _apiService.mutation('tenant.update', data);
      if (response == null) {
        throw TenantException('No data returned from updateTenant');
      }
      return Tenant.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateTenant', e, st);
      throw TenantException('Failed to update tenant: $e');
    }
  }

  /// Deletes a tenant by ID.
  /// Corresponds to `tenant.delete` tRPC procedure (soft delete).
  Future<void> deleteTenant(String id) async {
    try {
      await _apiService.mutation('tenant.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteTenant', e, st);
      throw TenantException('Failed to delete tenant: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[TenantService][$method] $error', error: error, stackTrace: st);
  }

  /// Alias for getAllTenants (for compatibility)
  Future<PaginatedResponse<Tenant>> getAll(
      {int page = 1, int pageSize = 10}) async {
    return await getTenants(page: page, pageSize: pageSize);
  }
}
