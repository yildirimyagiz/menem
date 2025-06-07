import 'package:mobile/api/api_service.dart';
import 'dart:developer';
import '../models/pricing_rule.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for pricing rule-related errors.
class PricingRuleException implements Exception {
  final String message;
  PricingRuleException(this.message);
  @override
  String toString() => 'PricingRuleException: $message';
}

/// Service for handling pricing rule-related API operations via TRPC.
class PricingRuleService {
  final ApiService _apiService;

  PricingRuleService(this._apiService);

  /// Fetches pricing rules with pagination and filtering.
  Future<PaginatedResponse<PricingRule>> getPricingRules({
    int page = 1,
    int limit = 10,
    String? name,
    String? propertyId,
    String? currencyId,
    double? basePriceMin,
    double? basePriceMax,
    DateTime? startDateFrom,
    DateTime? startDateTo,
    DateTime? endDateFrom,
    DateTime? endDateTo,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (name != null) params['name'] = name;
      if (propertyId != null) params['propertyId'] = propertyId;
      if (currencyId != null) params['currencyId'] = currencyId;
      if (basePriceMin != null) params['basePriceMin'] = basePriceMin;
      if (basePriceMax != null) params['basePriceMax'] = basePriceMax;
      if (startDateFrom != null) {
        params['startDateFrom'] = startDateFrom.toIso8601String();
      }
      if (startDateTo != null) {
        params['startDateTo'] = startDateTo.toIso8601String();
      }
      if (endDateFrom != null) {
        params['endDateFrom'] = endDateFrom.toIso8601String();
      }
      if (endDateTo != null) params['endDateTo'] = endDateTo.toIso8601String();
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query('pricingRule.all', params);
      if (response == null) {
        throw PricingRuleException('No data returned from getPricingRules');
      }
      return PaginatedResponse<PricingRule>.fromJson(
        response as Map<String, dynamic>,
        (json) => PricingRule.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e, st) {
      _logError('getPricingRules', e, st);
      throw PricingRuleException('Failed to get pricing rules: $e');
    }
  }

  /// Creates a new pricing rule.
  Future<PricingRule?> getPricingRuleById(String id) async {
    try {
      final response = await _apiService.query('pricingRule.byId', {'id': id});
      if (response == null) {
        return null; // Or throw PricingRuleException('Pricing rule not found', code: 'NOT_FOUND');
      }
      return PricingRule.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getPricingRuleById', e, st);
      if (e.toString().contains('NOT_FOUND')) return null;
      throw PricingRuleException('Failed to get pricing rule by ID $id: $e');
    }
  }

  /// Creates a new pricing rule.
  Future<PricingRule> createPricingRule(PricingRule rule) async {
    try {
      final response = await _apiService.mutation(
        'pricingRule.create',
        rule.toJson(),
      );
      if (response == null) {
        throw PricingRuleException('No data returned from createPricingRule');
      }
      return PricingRule.fromJson(response);
    } catch (e, st) {
      _logError('createPricingRule', e, st);
      throw PricingRuleException('Failed to create pricing rule: $e');
    }
  }

  /// Updates an existing pricing rule.
  Future<PricingRule> updatePricingRule(PricingRule rule) async {
    try {
      final response = await _apiService.mutation(
        'pricingRule.update',
        rule.toJson(),
      );
      if (response == null) {
        throw PricingRuleException('No data returned from updatePricingRule');
      }
      return PricingRule.fromJson(response);
    } catch (e, st) {
      _logError('updatePricingRule', e, st);
      throw PricingRuleException('Failed to update pricing rule: $e');
    }
  }

  /// Deletes a pricing rule by ID.
  Future<void> deletePricingRule(String ruleId) async {
    try {
      await _apiService.mutation(
        'pricingRule.delete',
        {'id': ruleId},
      );
    } catch (e, st) {
      _logError('deletePricingRule', e, st);
      throw PricingRuleException('Failed to delete pricing rule: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[PricingRuleService][$method] $error', error: error, stackTrace: st);
  }
}
