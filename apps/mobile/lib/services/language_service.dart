import 'package:flutter/foundation.dart';
import '../models/language.dart';
import 'dart:developer';
import 'package:mobile/api/api_service.dart'; // Import ApiService
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for language-related errors.
class LanguageException implements Exception {
  final String message;
  final String? code;

  LanguageException(this.message, {this.code});

  /// Creates a "not found" language exception.
  factory LanguageException.notFound(String message) =>
      LanguageException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'LanguageException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling language-related API operations via TRPC.
class LanguageService {
  final ApiService _apiService;

  LanguageService(this._apiService);

  /// Fetches all languages (optionally filtered).
  Future<PaginatedResponse<Language>> getLanguages({
    int page = 1,
    int limit = 10,
    String? code,
    String? name,
    String? nativeName,
    bool? isRTL,
    bool? isActive,
    String? agencyId,
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (code != null) params['code'] = code;
      if (name != null) params['name'] = name;
      if (nativeName != null) params['nativeName'] = nativeName;
      if (isRTL != null) params['isRTL'] = isRTL;
      if (isActive != null) params['isActive'] = isActive;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'language.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw LanguageException('No data returned from getLanguages');
      }
      return PaginatedResponse<Language>.fromJson(
        response,
        (json) => Language.fromJson(json as Map<String, dynamic>),
        dataKey: '', // Assuming backend returns data at root or 'data' key
      );
    } catch (e, st) {
      _logError('getLanguages', e, st);
      throw LanguageException('Failed to get languages: $e');
    }
  }

  /// Fetches a single language by ID.
  Future<Language> getLanguage(String id) async {
    try {
      final response = await _apiService.query(
        'language.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw LanguageException.notFound(
            'Language not found with ID: $id. No data returned.');
      }
      return Language.fromJson(response);
    } catch (e, st) {
      _logError('getLanguage', e, st);
      if (e is LanguageException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw LanguageException.notFound('Language not found with ID: $id.');
      }
      throw LanguageException('Failed to get language: $e');
    }
  }

  /// Creates a new language.
  Future<Language> createLanguage({
    // Parameters based on CreateLanguageSchema
    required String code,
    required String name,
    String? nativeName,
    bool? isRTL,
    bool? isActive,
    String? agencyId,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'code': code,
        'name': name,
      };
      if (nativeName != null) params['nativeName'] = nativeName;
      if (isRTL != null) params['isRTL'] = isRTL;
      if (isActive != null) params['isActive'] = isActive;
      if (agencyId != null) params['agencyId'] = agencyId;

      final response = await _apiService.mutation(
        'language.create',
        params,
      );
      if (response == null) {
        throw LanguageException('No data returned from createLanguage');
      }
      return Language.fromJson(response);
    } catch (e, st) {
      _logError('createLanguage', e, st);
      throw LanguageException('Failed to create language: $e');
    }
  }

  /// Updates an existing language by ID.
  Future<Language> updateLanguage({
    // Parameters based on UpdateLanguageSchema
    required String id,
    String? code,
    String? name,
    String? nativeName,
    bool? isRTL,
    bool? isActive,
    String? agencyId,
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (code != null) params['code'] = code;
      if (name != null) params['name'] = name;
      if (nativeName != null) params['nativeName'] = nativeName;
      if (isRTL != null) params['isRTL'] = isRTL;
      if (isActive != null) params['isActive'] = isActive;
      if (agencyId != null) params['agencyId'] = agencyId;

      final response = await _apiService.mutation(
        'language.update',
        params,
      );
      if (response == null) {
        throw LanguageException('No data returned from updateLanguage');
      }
      return Language.fromJson(response);
    } catch (e, st) {
      _logError('updateLanguage', e, st);
      if (e is LanguageException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw LanguageException.notFound(
            'Language not found for update with ID: $id.');
      }
      throw LanguageException('Failed to update language: $e');
    }
  }

  /// Deletes a language by ID.
  Future<void> deleteLanguage(String id) async {
    try {
      await _apiService.mutation('language.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteLanguage', e, st);
      if (e is LanguageException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw LanguageException.notFound(
            'Language not found or already deleted with ID: $id.');
      }
      throw LanguageException('Failed to delete language: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[LanguageService][$method] $error', error: error, stackTrace: st);
    if (kDebugMode) {
      print('LanguageService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }

  Future searchLanguages(String query) async {}
}
