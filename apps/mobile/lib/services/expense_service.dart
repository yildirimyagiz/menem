import 'dart:async';

import 'package:flutter/foundation.dart';

import '../models/expense.dart';
import 'dart:developer';
import '../api/api_service.dart';
import '../models/pagination.dart'; // For PaginatedResponse

/// Custom exception for expense-related errors.
class ExpenseException implements Exception {
  final String message;
  final String? code;

  ExpenseException(this.message, {this.code});

  /// Creates a "not found" expense exception.
  factory ExpenseException.notFound(String message) =>
      ExpenseException(message, code: 'NOT_FOUND');

  @override
  String toString() =>
      'ExpenseException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling expense-related API operations via TRPC.
class ExpenseService {
  final ApiService _apiService;

  ExpenseService(this._apiService);

  /// Fetches all expenses (optionally filtered).
  Future<PaginatedResponse<Expense>> getExpenses({
    int page = 1,
    int limit = 10,
    String? propertyId,
    String? tenantId,
    String? agencyId,
    String? type, // Assuming ExpenseType enum or String
    String? status, // Assuming ExpenseStatus enum or String
    String? sortBy,
    String sortOrder = 'desc',
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        'sortOrder': sortOrder,
      };
      if (propertyId != null) params['propertyId'] = propertyId;
      if (tenantId != null) params['tenantId'] = tenantId;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (type != null) params['type'] = type;
      if (status != null) params['status'] = status;
      if (sortBy != null) params['sortBy'] = sortBy;

      final response = await _apiService.query(
        'expense.all', // Corrected procedure name
        params,
      );
      if (response == null) {
        throw ExpenseException('No data returned from getExpenses');
      }
      return PaginatedResponse<Expense>.fromJson(
        response,
        (json) => Expense.fromJson(json as Map<String, dynamic>),
        dataKey: '',
      );
    } catch (e, st) {
      _logError('getExpenses', e, st);
      throw ExpenseException('Failed to get expenses: $e');
    }
  }

  /// Fetches a single expense by ID.
  Future<Expense> getExpense(String id) async {
    try {
      final response = await _apiService.query(
        'expense.byId', // Corrected procedure name
        {'id': id},
      );
      if (response == null) {
        throw ExpenseException.notFound(
            'Expense not found with ID: $id. No data returned.');
      }
      return Expense.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getExpense', e, st);
      if (e is ExpenseException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ExpenseException.notFound('Expense not found with ID: $id.');
      }
      throw ExpenseException('Failed to get expense: $e');
    }
  }

  /// Creates a new expense.
  Future<Expense> createExpense({
    // Parameters based on CreateExpenseSchema
    required String description,
    required double amount,
    required DateTime expenseDate,
    required String currencyId,
    String? propertyId,
    String? tenantId,
    String? agencyId,
    String? type,
    String? status,
    String? category,
    String? paymentMethod,
    String? reference,
    String? notes,
    String? createdById,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'description': description,
        'amount': amount,
        'expenseDate': expenseDate.toIso8601String(),
        'currencyId': currencyId,
      };
      if (propertyId != null) params['propertyId'] = propertyId;
      if (tenantId != null) params['tenantId'] = tenantId;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (type != null) params['type'] = type;
      if (status != null) params['status'] = status;
      if (category != null) params['category'] = category;
      if (paymentMethod != null) params['paymentMethod'] = paymentMethod;
      if (reference != null) params['reference'] = reference;
      if (notes != null) params['notes'] = notes;
      if (createdById != null) params['createdById'] = createdById;

      final response = await _apiService.mutation(
        'expense.create',
        params,
      );
      if (response == null) {
        throw ExpenseException('No data returned from createExpense');
      }
      return Expense.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createExpense', e, st);
      throw ExpenseException('Failed to create expense: $e');
    }
  }

  /// Updates an existing expense by ID.
  Future<Expense> updateExpense({
    // Parameters based on UpdateExpenseSchema
    required String id,
    String? description,
    double? amount,
    DateTime? expenseDate,
    String? currencyId,
    String? propertyId,
    String? tenantId,
    String? agencyId,
    String? type,
    String? status,
    String? category,
    String? paymentMethod,
    String? reference,
    String? notes,
  }) async {
    try {
      final Map<String, dynamic> params = {'id': id};
      if (description != null) params['description'] = description;
      if (amount != null) params['amount'] = amount;
      if (expenseDate != null) {
        params['expenseDate'] = expenseDate.toIso8601String();
      }
      if (currencyId != null) params['currencyId'] = currencyId;
      if (propertyId != null) params['propertyId'] = propertyId;
      if (tenantId != null) params['tenantId'] = tenantId;
      if (agencyId != null) params['agencyId'] = agencyId;
      if (type != null) params['type'] = type;
      if (status != null) params['status'] = status;
      if (category != null) params['category'] = category;
      if (paymentMethod != null) params['paymentMethod'] = paymentMethod;
      if (reference != null) params['reference'] = reference;
      if (notes != null) params['notes'] = notes;

      final response = await _apiService.mutation(
        'expense.update',
        params,
      );
      if (response == null) {
        throw ExpenseException('No data returned from updateExpense');
      }
      return Expense.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('updateExpense', e, st);
      if (e is ExpenseException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ExpenseException.notFound(
            'Expense not found for update with ID: $id.');
      }
      throw ExpenseException('Failed to update expense: $e');
    }
  }

  /// Deletes an expense by ID.
  Future<void> deleteExpense(String id) async {
    try {
      await _apiService.mutation('expense.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteExpense', e, st);
      if (e is ExpenseException && e.code == 'NOT_FOUND') rethrow;
      if (e.toString().contains('not found') ||
          e.toString().contains('P2025')) {
        throw ExpenseException.notFound(
            'Expense not found or already deleted with ID: $id.');
      }
      throw ExpenseException('Failed to delete expense: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[ExpenseService][$method] $error', error: error, stackTrace: st);
    // Optionally log errors to a logging service or console
    if (kDebugMode) {
      print('ExpenseService.$method error: $error\n$st');
    }
    // Logging is handled here. Rethrowing or wrapping is done in the calling catch block.
  }

  Future<List<Expense>> getAll() async {
    try {
      final response = await _apiService.query('expense.all', {});
      if (response == null) {
        throw ExpenseException('No data returned from getExpenses');
      }
      
      final List<dynamic> data = response['data'] ?? [];
      return data.map((json) => Expense.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e, st) {
      _logError('getAll', e, st);
      throw ExpenseException('Failed to fetch expenses: $e');
    }
  }

  Future<List<Expense>> getExpensesByStatus(ExpenseStatus status) async {
    try {
      final response = await _apiService.query('expense.byStatus', 
        {'status': status.toString().split('.').last});
      
      if (response == null) {
        throw ExpenseException('No data returned for status: $status');
      }
      
      final List<dynamic> data = response['data'] ?? [];
      return data.map((json) => Expense.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e, st) {
      _logError('getExpensesByStatus', e, st);
      throw ExpenseException('Failed to fetch expenses by status: $e');
    }
  }
}
