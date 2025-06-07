import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/expense.dart';
import '../services/expense_service.dart';
import 'api_providers.dart';

part 'expense_providers.g.dart';

typedef ExpenseListAsync = AsyncValue<List<Expense>>;
typedef ExpenseDetailAsync = AsyncValue<Expense>;

@Riverpod(keepAlive: true)
ExpenseService expenseService(ref) {
  return ExpenseService(ref.watch(apiServiceProvider));
}

@riverpod
class ExpenseNotifier extends _$ExpenseNotifier {
  @override
  Future<List<Expense>> build() async {
    return _loadExpenses();
  }

  Future<List<Expense>> _loadExpenses() async {
    try {
      final response = await ref.read(expenseServiceProvider).getExpenses(
            page: 1,
            limit: 100,
            sortOrder: 'desc',
          );
      return response.data;
    } catch (e) {
      throw Exception('Failed to load expenses: $e');
    }
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _loadExpenses());
  }

  Future<void> getExpensesFiltered({
    String? propertyId,
    String? tenantId,
    String? agencyId,
    String? type,
    String? status,
    String? sortBy,
    String sortOrder = 'desc',
    int page = 1,
    int limit = 10,
  }) async {
    try {
      state = const AsyncValue.loading();
      final response = await ref.read(expenseServiceProvider).getExpenses(
            page: page,
            limit: limit,
            sortBy: sortBy,
            sortOrder: sortOrder,
            propertyId: propertyId,
            tenantId: tenantId,
            agencyId: agencyId,
            type: type,
            status: status,
          );
      state = AsyncValue.data(response.data);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> createExpense({
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
      state = const AsyncValue.loading();
      final newExpense = await ref.read(expenseServiceProvider).createExpense(
            description: description,
            amount: amount,
            expenseDate: expenseDate,
            currencyId: currencyId,
            propertyId: propertyId,
            tenantId: tenantId,
            agencyId: agencyId,
            type: type,
            status: status,
            category: category,
            paymentMethod: paymentMethod,
            reference: reference,
            notes: notes,
            createdById: createdById,
          );

      // Update the state with the new expense
      state = await AsyncValue.guard(() async {
        final currentExpenses = await _loadExpenses();
        return [...currentExpenses, newExpense];
      });
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> updateExpense({
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
      state = const AsyncValue.loading();
      final updatedExpense =
          await ref.read(expenseServiceProvider).updateExpense(
                id: id,
                description: description,
                amount: amount,
                expenseDate: expenseDate,
                currencyId: currencyId,
                propertyId: propertyId,
                tenantId: tenantId,
                agencyId: agencyId,
                type: type,
                status: status,
                category: category,
                paymentMethod: paymentMethod,
                reference: reference,
                notes: notes,
              );

      // Update the state with the updated expense
      state = await AsyncValue.guard(() async {
        final currentExpenses = await _loadExpenses();
        return currentExpenses
            .map((exp) => exp.id == id ? updatedExpense : exp)
            .toList();
      });
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> deleteExpense(String id) async {
    try {
      state = const AsyncValue.loading();
      await ref.read(expenseServiceProvider).deleteExpense(id);

      // Update the state by removing the deleted expense
      state = await AsyncValue.guard(() async {
        final currentExpenses = await _loadExpenses();
        return currentExpenses.where((exp) => exp.id != id).toList();
      });
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

@riverpod
class ExpenseDetailNotifier extends _$ExpenseDetailNotifier {
  @override
  Future<Expense> build(String id) async {
    return _loadExpense(id);
  }

  Future<Expense> _loadExpense(String id) async {
    try {
      return await ref.read(expenseServiceProvider).getExpense(id);
    } catch (e) {
      throw Exception('Failed to load expense: $e');
    }
  }

  Future<void> refreshDetail() async {
    final currentId = state.valueOrNull?.id;
    if (currentId != null) {
      state = const AsyncValue.loading();
      state = await AsyncValue.guard(() => _loadExpense(currentId));
    }
  }

  Future<void> updateCurrentExpense({
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
    final currentExpense = state.valueOrNull;
    if (currentExpense == null) return;

    final previousState = state;
    try {
      state = const AsyncValue.loading();

      final updatedExpense =
          await ref.read(expenseServiceProvider).updateExpense(
                id: currentExpense.id,
                description: description ?? currentExpense.description,
                amount: amount ?? currentExpense.amount,
                expenseDate: expenseDate ?? currentExpense.dueDate,
                currencyId: currencyId ?? currentExpense.currency,
                propertyId: propertyId ?? currentExpense.propertyId,
                tenantId: tenantId,
                agencyId: agencyId,
                type: type ?? currentExpense.type.name,
                status: status ?? currentExpense.status.name,
                category: category,
                paymentMethod: paymentMethod ?? currentExpense.paymentMethod,
                reference: reference,
                notes: notes,
              );

      state = AsyncValue.data(updatedExpense);
    } catch (e, st) {
      state = previousState;
      // Log the error with stack trace for debugging
      debugPrint('Error updating expense: $e');
      debugPrint('Stack trace: $st');
      rethrow;
    }
  }

  Future<void> deleteCurrentExpense() async {
    final currentExpense = state.valueOrNull;
    if (currentExpense == null) return;

    final previousState = state;
    try {
      state = const AsyncValue.loading();
      await ref.read(expenseServiceProvider).deleteExpense(currentExpense.id);
      // Create a minimal valid Expense object to satisfy the type system
      // This won't be used since the expense was deleted
      final now = DateTime.now();
      state = AsyncValue.data(Expense(
        id: 'deleted_${now.millisecondsSinceEpoch}',
        title: 'Deleted Expense',
        description: 'This expense has been deleted',
        type: ExpenseType.other,
        status: ExpenseStatus.cancelled,
        amount: 0,
        currency: 'USD',
        dueDate: now,
        propertyId: currentExpense.propertyId,
        isRecurring: false,
        createdAt: now,
        updatedAt: now,
      ));
    } catch (e, st) {
      state = previousState;
      // Log the error with stack trace for debugging
      debugPrint('Error deleting expense: $e');
      debugPrint('Stack trace: $st');
      rethrow;
    }
  }
}
