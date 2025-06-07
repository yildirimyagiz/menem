import 'dart:async';
import 'package:mobile/models/commission_rule.dart';
import 'package:mobile/models/pagination.dart';
import 'package:mobile/api/api_service.dart';

class CommissionRuleService {
  final ApiService _apiService;

  CommissionRuleService(this._apiService);

  Future<PaginatedResponse<CommissionRule>> getCommissionRules({
    int page = 1,
    int limit = 10,
    String? search,
    String? sortBy,
    bool? isActive,
  }) async {
    final input = {
      'pagination': {
        'page': page,
        'limit': limit,
      },
      if (search != null && search.isNotEmpty) 'search': search,
      if (sortBy != null) 'sortBy': sortBy,
      if (isActive != null) 'isActive': isActive,
    };

    final response = await _apiService.query('commissionRules', input);
    
    return PaginatedResponse<CommissionRule>.fromJson(
      response as Map<String, dynamic>,
      (json) => CommissionRule.fromJson(json as Map<String, dynamic>),
      dataKey: 'data',
    );
  }

  Future<CommissionRule> getCommissionRule(String id) async {
    final response = await _apiService.query('getCommissionRule', {'id': id});
    return CommissionRule.fromJson(response as Map<String, dynamic>);
  }

  Future<CommissionRule> createCommissionRule(CommissionRule rule) async {
    final response = await _apiService.mutation(
      'createCommissionRule',
      rule.toJson(),
    );
    return CommissionRule.fromJson(response as Map<String, dynamic>);
  }

  Future<CommissionRule> updateCommissionRule(
    String id, {
    required Map<String, dynamic> updates,
  }) async {
    final response = await _apiService.mutation(
      'updateCommissionRule',
      {'id': id, ...updates},
    );
    return CommissionRule.fromJson(response as Map<String, dynamic>);
  }

  Future<void> deleteCommissionRule(String id) async {
    await _apiService.mutation('deleteCommissionRule', {'id': id});
  }
}
