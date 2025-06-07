import 'package:flutter/foundation.dart';

import '../api/api_service.dart'; // Import ApiService
import '../models/pagination.dart'; // Import PaginatedResponse
import '../models/currency.dart';
import 'dart:developer';

/// Custom exception for currency-related errors.
class CurrencyException implements Exception {
  final String message;
  final String? code;

  CurrencyException(this.message, {this.code});

  /// Creates a "not found" currency exception.
  factory CurrencyException.notFound(String message) =>
      CurrencyException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'CurrencyException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling currency-related API operations via TRPC.
class CurrencyService {
  final ApiService _apiService; // Changed from TrpcClient to ApiService

  CurrencyService(this._apiService); // Updated constructor

  /// Fetches all currencies (optionally filtered).
  Future<PaginatedResponse<Currency>> getCurrencies({
    int page = 1,
    int limit = 10,
    // Add other filter parameters based on FacilityFilterSchema if needed
    // e.g., String? search, bool? isActive,
  }) async {
    try {
      final response = await _apiService.query(
        'currency.getAll',
        {
          'page': page,
          'limit': limit,
          // Add other filter params here
        },
      );
      if (response == null) {
        throw CurrencyException('No data returned from getCurrencies');
      }
      // Assuming the response structure is similar to PaginatedResponse
      return PaginatedResponse<Currency>.fromJson(
        response,
        (json) => Currency.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getCurrencies', e, st);
      throw CurrencyException('Failed to get currencies: $e');
    }
  }

  /// Fetches a single currency by ID.
  Future<Currency> getCurrency(String id) async {
    try {
      final response = await _apiService.query(
        'currency.byId', // Corrected procedure name from 'currency.get'
        {'id': id},
      );
      if (response == null) {
        throw CurrencyException.notFound(
            'Currency not found with ID: $id. No data returned.');
      }
      return Currency.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getCurrency', e, st);
      if (e is CurrencyException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw CurrencyException.notFound('Currency not found with ID: $id.');
      }
      throw CurrencyException('Failed to get currency: $e');
    }
  }

  /// Creates a new currency.
  Future<Currency> createCurrency({
    required String code,
    required String name,
    String? symbol, // Added based on currency.ts update schema
    double? exchangeRate, // Added based on currency.ts update schema
  }) async {
    try {
      final Map<String, dynamic> params = {
        'code': code,
        'name': name,
      };
      if (symbol != null) params['symbol'] = symbol;
      if (exchangeRate != null) params['exchangeRate'] = exchangeRate;

      final response = await _apiService.mutation(
        'currency.create',
        params,
      );
      if (response == null) {
        throw CurrencyException('No data returned from createCurrency');
      }
      return Currency.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createCurrency', e, st);
      throw CurrencyException('Failed to create currency: $e');
    }
  }

  /// Updates an existing currency by ID.
  Future<Currency> updateCurrency({
    required String id,
    String? code,
    String? name,
    String? symbol,
    double? exchangeRate,
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (code != null) params['code'] = code;
      if (name != null) params['name'] = name;
      if (symbol != null) params['symbol'] = symbol;
      if (exchangeRate != null) params['exchangeRate'] = exchangeRate;

      final response = await _apiService.mutation(
        'currency.update',
        params,
      );
      if (response == null) {
        throw CurrencyException('No data returned from updateCurrency');
      }
      return Currency.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateCurrency', e, st);
      if (e is CurrencyException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw CurrencyException.notFound(
            'Currency not found for update with ID: $id.');
      }
      throw CurrencyException('Failed to update currency: $e');
    }
  }

  /// Deletes a currency by ID.
  Future<void> deleteCurrency(String id) async {
    try {
      await _apiService.mutation('currency.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteCurrency', e, st);
      if (e is CurrencyException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw CurrencyException.notFound(
            'Currency not found or already deleted with ID: $id.');
      }
      throw CurrencyException('Failed to delete currency: $e');
    }
  }

  /// Fetches exchange rates relative to a base currency.
  Future<Map<String, double>> getExchangeRates(String baseCurrency) async {
    try {
      final response = await _apiService.query(
        'currency.getExchangeRates',
        {'baseCurrency': baseCurrency},
      );
      if (response == null) {
        throw CurrencyException(
            'No data returned from getExchangeRates for base: $baseCurrency');
      }
      if (response is Map) {
        // The backend returns Record<string, number>, which translates to Map<String, dynamic>
        // where dynamic should be double or int.
        return response.map(
            (key, value) => MapEntry(key as String, (value as num).toDouble()));
      }
      throw CurrencyException(
          'Unexpected response format from getExchangeRates.');
    } catch (e, st) {
      _logError('getExchangeRates', e, st);
      throw CurrencyException('Failed to get exchange rates: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[CurrencyService][$method] $error', error: error, stackTrace: st);
    // Optionally log errors to a logging service or console
    if (kDebugMode) {
      print('CurrencyService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }
}
