import 'dart:developer';

import 'package:mobile/api/api_service.dart';
import 'package:mobile/exceptions/account_exception.dart';
import 'package:mobile/models/account.dart'; // Assuming this import brings Account and its AccountType enum
import 'package:mobile/models/pagination.dart';

class AccountService {
  final ApiService _apiService;

  AccountService(this._apiService);

  Future<PaginatedResponse<Account>> getAccounts({
    int page = 1,
    int limit = 10,
    String? userId,
    AccountType? type, // Now using AccountType from models/account.dart
    String? provider,
    String? providerAccountId,
    String? sortBy,
    String sortOrder = 'asc',
  }) async {
    try {
      final response = await _apiService.query(
        'account.all',
        {
          'page': page,
          'limit': limit,
          if (userId != null) 'userId': userId,
          if (type != null)
            'type': type
                .name, // Rely on @JsonValue in model's enum for correct string
          if (provider != null) 'provider': provider,
          if (providerAccountId != null) 'providerAccountId': providerAccountId,
          if (sortBy != null) 'sortBy': sortBy,
          'sortOrder': sortOrder,
        },
      );

      if (response == null) {
        throw AccountException('No data returned from getAccounts');
      }

      return PaginatedResponse<Account>.fromJson(
        response,
        (json) => Account.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getAccounts', e, st);
      throw AccountException('Failed to get accounts: $e');
    }
  }

  Future<List<Account>> getAccountsByUser(String userId) async {
    try {
      final response = await getAccounts(userId: userId);
      return response.data;
    } catch (e, st) {
      _logError('getAccountsByUser', e, st);
      throw AccountException('Failed to get accounts by user: $e');
    }
  }

  Future<Account> getAccount(String id) async {
    try {
      final response = await _apiService.query(
        'account.byId',
        {'id': id},
      );

      if (response == null) {
        throw AccountException('Account not found', code: 'NOT_FOUND');
      }

      return Account.fromJson(response);
    } catch (e, st) {
      _logError('getAccount', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw AccountException('Account not found', code: 'NOT_FOUND');
      }
      throw AccountException('Failed to get account: $e');
    }
  }

  Future<Account> createAccount({
    required String userId,
    required AccountType type, // Now using AccountType from models/account.dart
    required String provider,
    required String providerAccountId,
    String? refreshToken,
    String? accessToken,
    int? expiresAt,
    String? tokenType,
    String? scope,
    String? idToken,
    String? sessionState,
  }) async {
    try {
      final response = await _apiService.mutation(
        'account.create',
        {
          'userId': userId,
          'type': type.name, // Rely on @JsonValue in model's enum
          'provider': provider,
          'providerAccountId': providerAccountId,
          'refreshToken': refreshToken,
          'accessToken': accessToken,
          'expiresAt': expiresAt,
          'tokenType': tokenType,
          'scope': scope,
          'idToken': idToken,
          'sessionState': sessionState,
        },
      );

      if (response == null) {
        throw AccountException('No data returned from createAccount');
      }

      return Account.fromJson(response);
    } catch (e, st) {
      _logError('createAccount', e, st);
      throw AccountException('Failed to create account: $e');
    }
  }

  Future<Account> updateAccount({
    required String id,
    String? refreshToken,
    String? accessToken,
    int? expiresAt,
    String? tokenType,
    String? scope,
    String? idToken,
    String? sessionState,
    bool? isActive, // Added to align with UpdateAccountSchema
  }) async {
    try {
      final response = await _apiService.mutation(
        'account.update',
        {
          'id': id,
          'refreshToken': refreshToken,
          'accessToken': accessToken,
          'expiresAt': expiresAt,
          'tokenType': tokenType,
          'scope': scope,
          'idToken': idToken,
          'sessionState': sessionState,
          if (isActive != null)
            'isActive': isActive, // Add isActive if provided
        },
      );

      if (response == null) {
        throw AccountException('No data returned from updateAccount');
      }

      return Account.fromJson(response);
    } catch (e, st) {
      _logError('updateAccount', e, st);
      throw AccountException('Failed to update account: $e');
    }
  }

  Future<Account> updateAccountStatus({
    required String id,
    required bool isActive,
  }) async {
    try {
      final response = await _apiService.mutation(
        'account.update',
        {
          'id': id,
          'isActive': isActive,
        },
      );

      if (response == null) {
        throw AccountException('No data returned from updateAccountStatus');
      }

      return Account.fromJson(response);
    } catch (e, st) {
      _logError('updateAccountStatus', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw AccountException('Account not found', code: 'NOT_FOUND');
      }
      throw AccountException('Failed to update account status: $e');
    }
  }

  Future<void> deleteAccount(String id) async {
    try {
      await _apiService.mutation('account.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteAccount', e, st);
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw AccountException('Account not found or already deleted',
            code: 'NOT_FOUND');
      }
      throw AccountException('Failed to delete account: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[AccountService][$method] $error', error: error, stackTrace: st);
  }
}
