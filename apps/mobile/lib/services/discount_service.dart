import 'dart:developer';
import 'package:flutter/foundation.dart'; // For kDebugMode
import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/discount.dart';
import 'package:mobile/models/pagination.dart';

/// Custom exception for discount-related errors.
class DiscountException implements Exception {
  final String message;
  final String? code;

  DiscountException(this.message, {this.code});

  factory DiscountException.notFound(String message) =>
      DiscountException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'DiscountException: $message${code != null ? ' (Code: $code)' : ''}';
}

class DiscountService {
  final ApiService _apiService;

  DiscountService(this._apiService);

  Future<PaginatedResponse<Discount>> getDiscounts({
    int page = 1,
    int limit = 10,
    String? type,
    String? code,
    bool? isActive,
    String? query, // For general search
    String? sortBy,
    String sortOrder = 'asc',
  }) async {
    try {
      final params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (type != null) params['type'] = type;
      if (code != null) params['code'] = code;
      if (isActive != null) params['isActive'] = isActive;
      if (query != null) params['query'] = query; // General search query
      if (sortBy != null) params['sortBy'] = sortBy;

      // Assuming endpoint 'discount.all'
      final response = await _apiService.query('discount.all', params);
      if (response == null) {
        throw DiscountException('No data returned from getDiscounts');
      }
      return PaginatedResponse<Discount>.fromJson(
        response,
        (json) => Discount.fromJson(json as Map<String, dynamic>),
        dataKey: 'items', // Assuming 'items' based on other services
      );
    } catch (e, st) {
      _logError('getDiscounts', e, st);
      throw DiscountException('Failed to get discounts: $e');
    }
  }

  Future<Discount> getDiscount(String id) async {
    try {
      // Assuming endpoint 'discount.byId'
      final response = await _apiService.query('discount.byId', {'id': id});
      if (response == null) {
        throw DiscountException.notFound(
            'Discount not found with ID: $id. No data returned.');
      }
      return Discount.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getDiscount', e, st);
      if (e is DiscountException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw DiscountException.notFound('Discount not found with ID: $id.');
      }
      throw DiscountException('Failed to get discount: $e');
    }
  }

  Future<Discount?> getDiscountByCode(String code) async {
    try {
      final response = await getDiscounts(code: code, limit: 1);
      return response.data.isNotEmpty ? response.data.first : null;
    } catch (e, st) {
      _logError('getDiscountByCode', e, st);
      if (e is DiscountException && e.code == 'NOT_FOUND') return null;
      if (e.toString().contains('not found') || e.toString().contains('P2025')) {
        return null;
      }
      throw DiscountException('Failed to get discount by code: $e');
    }
  }

  Future<Discount> createDiscount({
    required String code,
    required String type,
    required double value,
    String? description,
    DateTime? startDate,
    DateTime? endDate,
    int? usageLimit,
    bool isActive = true,
    // Add other fields from Discount model as needed
  }) async {
    try {
      final params = {
        'code': code,
        'type': type,
        'value': value,
        'isActive': isActive,
        if (description != null) 'description': description,
        if (startDate != null) 'startDate': startDate.toIso8601String(),
        if (endDate != null) 'endDate': endDate.toIso8601String(),
        if (usageLimit != null) 'usageLimit': usageLimit,
      };
      // Assuming endpoint 'discount.create'
      final response = await _apiService.mutation('discount.create', params);
      if (response == null) {
        throw DiscountException('No data returned from createDiscount');
      }
      return Discount.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createDiscount', e, st);
      throw DiscountException('Failed to create discount: $e');
    }
  }

  Future<Discount> updateDiscount({
    required String id,
    String? code,
    String? type,
    double? value,
    String? description,
    DateTime? startDate,
    DateTime? endDate,
    int? usageLimit,
    bool? isActive,
  }) async {
    try {
      final params = {'id': id};
      if (code != null) params['code'] = code;
      if (type != null) params['type'] = type;
      if (value != null) params['value'] = value as String;
      if (description != null) params['description'] = description;
      if (startDate != null) params['startDate'] = startDate.toIso8601String();
      if (endDate != null) params['endDate'] = endDate.toIso8601String();
      if (usageLimit != null) params['usageLimit'] = usageLimit as String;
      if (isActive != null) params['isActive'] = isActive as String;

      // Assuming endpoint 'discount.update'
      final response = await _apiService.mutation('discount.update', params);
      if (response == null) {
        throw DiscountException('No data returned from updateDiscount');
      }
      return Discount.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateDiscount', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw DiscountException.notFound(
            'Discount not found for update with ID: $id.');
      }
      throw DiscountException('Failed to update discount: $e');
    }
  }

  Future<Discount> updateDiscountStatus(
      {required String id, required bool isActive}) async {
    return updateDiscount(id: id, isActive: isActive);
  }

  Future<void> deleteDiscount(String id) async {
    try {
      // Assuming endpoint 'discount.delete'
      await _apiService.mutation('discount.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteDiscount', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw DiscountException.notFound(
            'Discount not found or already deleted with ID: $id.');
      }
      throw DiscountException('Failed to delete discount: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[DiscountService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('DiscountService.$method error: $error\n$st');
    }
  }
}
