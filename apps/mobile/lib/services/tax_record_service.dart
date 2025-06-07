import 'package:mobile/models/tax_record.dart';
import 'dart:developer';
import 'package:mobile/api/api_service.dart';

/// Custom exception for tax record-related errors.
class TaxRecordException implements Exception {
  final String message;
  TaxRecordException(this.message);
  @override
  String toString() => 'TaxRecordException: $message';
}


/// Service for handling tax record-related API operations via TRPC.
class TaxRecordService {
  final ApiService _apiService;

  TaxRecordService(this._apiService);

  /// Fetches all tax records.
  Future<List<TaxRecord>> getAllTaxRecords() async {
    try {
      final response = await _apiService.query(
        'taxRecord.getAll',
        {},
      );
      if (response == null) {
        throw TaxRecordException('No data returned from getAllTaxRecords');
      }
      return (response as List)
          .map((json) => TaxRecord.fromJson(json))
          .toList();
    } catch (e, st) {
      _logError('getAllTaxRecords', e, st);
      throw TaxRecordException('Failed to get tax records: $e');
    }
  }

  /// Fetches a single tax record by ID.
  Future<TaxRecord> getTaxRecordById(String id) async {
    try {
      final response = await _apiService.query(
        'taxRecord.get',
        {'id': id},
      );
      if (response == null) {
        throw TaxRecordException('No data returned from getTaxRecordById');
      }
      return TaxRecord.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getTaxRecordById', e, st);
      throw TaxRecordException('Failed to get tax record: $e');
    }
  }

  /// Creates a new tax record. All fields from the TaxRecord model (except id, createdAt, updatedAt, deletedAt) should be provided.
  Future<TaxRecord> createTaxRecord({
    required int year,
    required int quarter,
    required double totalIncome,
    required double totalExpenses,
    required double taxableIncome,
    required double taxAmount,
    required TaxStatus status,
    required DateTime dueDate,
    DateTime? paidDate,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) async {
    try {
      final response = await _apiService.mutation(
        'taxRecord.create',
        {
          'year': year,
          'quarter': quarter,
          'totalIncome': totalIncome,
          'totalExpenses': totalExpenses,
          'taxableIncome': taxableIncome,
          'taxAmount': taxAmount,
          'status': status.toString().split('.').last,
          'dueDate': dueDate.toIso8601String(),
          if (paidDate != null) 'paidDate': paidDate.toIso8601String(),
          if (metadata != null) 'metadata': metadata,
          if (createdBy != null) 'createdBy': createdBy,
          if (updatedBy != null) 'updatedBy': updatedBy,
        },
      );
      if (response == null) {
        throw TaxRecordException('No data returned from createTaxRecord');
      }
      return TaxRecord.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createTaxRecord', e, st);
      throw TaxRecordException('Failed to create tax record: $e');
    }
  }

  /// Updates an existing tax record by ID. All updatable fields from the TaxRecord model can be provided.
  Future<TaxRecord> updateTaxRecord({
    required String id,
    int? year,
    int? quarter,
    double? totalIncome,
    double? totalExpenses,
    double? taxableIncome,
    double? taxAmount,
    TaxStatus? status,
    DateTime? dueDate,
    DateTime? paidDate,
    Map<String, dynamic>? metadata,
    String? createdBy,
    String? updatedBy,
  }) async {
    try {
      final response = await _apiService.mutation(
        'taxRecord.update',
        {
          'id': id,
          if (year != null) 'year': year,
          if (quarter != null) 'quarter': quarter,
          if (totalIncome != null) 'totalIncome': totalIncome,
          if (totalExpenses != null) 'totalExpenses': totalExpenses,
          if (taxableIncome != null) 'taxableIncome': taxableIncome,
          if (taxAmount != null) 'taxAmount': taxAmount,
          if (status != null) 'status': status.toString().split('.').last,
          if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
          if (paidDate != null) 'paidDate': paidDate.toIso8601String(),
          if (metadata != null) 'metadata': metadata,
          if (createdBy != null) 'createdBy': createdBy,
          if (updatedBy != null) 'updatedBy': updatedBy,
        },
      );
      if (response == null) {
        throw TaxRecordException('No data returned from updateTaxRecord');
      }
      return TaxRecord.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateTaxRecord', e, st);
      throw TaxRecordException('Failed to update tax record: $e');
    }
  }

  /// Deletes a tax record by ID.
  Future<void> deleteTaxRecord(String id) async {
    try {
      await _apiService.mutation('taxRecord.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteTaxRecord', e, st);
      throw TaxRecordException('Failed to delete tax record: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[TaxRecordService][$method] $error', error: error, stackTrace: st);
  }

  Future getAll() async {}
}
