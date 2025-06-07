// ignore_for_file: deprecated_member_use_from_same_package

import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/account.dart';
import '../services/account_service.dart'; // Import AccountService
import 'api_provider.dart'; // To provide ApiService for AccountService

part 'account_providers.g.dart';

// Provider for AccountService
@riverpod
AccountService accountService(AccountServiceRef ref) {
  return AccountService(ref.watch(apiServiceProvider));
}

@riverpod
class AccountNotifier extends _$AccountNotifier {
  @override
  FutureOr<List<Account>> build() async {
    // AccountService.getAccounts returns PaginatedResponse<Account>.
    // We'll fetch the first page here. UI might need pagination controls.
    final paginatedResponse =
        await ref.read(accountServiceProvider).getAccounts();
    return paginatedResponse.data;
  }

  /// Refresh the list of all accounts
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse =
          await ref.read(accountServiceProvider).getAccounts();
      return paginatedResponse.data;
    });
  }

  /// Fetch accounts by user ID
  Future<void> getByUser(String userId) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // AccountService.getAccounts can filter by userId
      final paginatedResponse =
          await ref.read(accountServiceProvider).getAccounts(userId: userId);
      return paginatedResponse.data;
    });
  }

  /// Create a new account
  Future<void> createAccount({
    required String userId,
    required AccountType type,
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
    // Capture the state before attempting the operation.
    // This is useful for reverting or showing previous data on error.
    final previousAsyncState = state;
    state = const AsyncValue.loading(); // Indicate loading for the operation
    try {
      await ref.read(accountServiceProvider).createAccount(
            userId: userId,
            type: type,
            // provider: provider, // Corrected: 'provider' is a named parameter
            // providerAccountId: providerAccountId, // Corrected: 'providerAccountId' is a named parameter
            provider: provider,
            providerAccountId: providerAccountId,
            refreshToken: refreshToken,
            accessToken: accessToken,
            expiresAt: expiresAt,
            tokenType: tokenType,
            scope: scope,
            idToken: idToken,
            sessionState: sessionState,
          );
      await refresh(); // Refresh the list after creation (safer with pagination/sorting)
    } catch (e, st) {
      // If there was data before, create an error state that preserves it.
      if (previousAsyncState is AsyncData<List<Account>>) {
        state = AsyncError<List<Account>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        // Otherwise, just set the error state.
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Update an existing account
  Future<void> updateAccount({
    required String id,
    String? refreshToken,
    String? accessToken,
    int? expiresAt,
    String? tokenType,
    String? scope,
    String? idToken,
    String? sessionState,
    bool? isActive,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading(); // Indicate loading for the update
    try {
      // AccountService.updateAccount returns the updated Account.
      final updatedAccount = await ref
          .read(accountServiceProvider)
          .updateAccount(
              id: id,
              refreshToken: refreshToken,
              accessToken: accessToken,
              expiresAt: expiresAt,
              tokenType: tokenType,
              scope: scope,
              idToken: idToken,
              sessionState: sessionState,
              isActive: isActive);
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state = AsyncValue.data(
          currentData
              .map((acc) => acc.id == updatedAccount.id ? updatedAccount : acc)
              .toList(),
        );
      } else {
        // If no current data, a full refresh is needed
        await refresh(); // Fallback if no current data to update
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Account>>) {
        state = AsyncError<List<Account>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Update the status of an account
  Future<void> updateAccountStatus(String id, bool isActive) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      // AccountService.updateAccountStatus returns the updated Account.
      final updatedAccount =
          await ref.read(accountServiceProvider).updateAccountStatus(
                id: id,
                isActive: isActive,
              );
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state = AsyncValue.data(
          currentData
              .map((acc) => acc.id == updatedAccount.id ? updatedAccount : acc)
              .toList(),
        );
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Account>>) {
        state = AsyncError<List<Account>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Delete an account
  Future<void> deleteAccount(String id) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      // Assuming deleteAccount service method completes successfully
      await ref.read(accountServiceProvider).deleteAccount(id);
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        // Optimistically remove the deleted account from the list
        state =
            AsyncValue.data(currentData.where((acc) => acc.id != id).toList());
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Account>>) {
        state = AsyncError<List<Account>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }
}

@riverpod
class AccountDetailNotifier extends _$AccountDetailNotifier {
  @override
  FutureOr<Account?> build(String id) async {
    return ref.read(accountServiceProvider).getAccount(id);
  }

  /// Refresh the detail for the current account
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // The 'id' is passed to the build method and available via `this.id` (or simply `id`)
      // or re-fetch using the initially provided id for the family.
      return ref.read(accountServiceProvider).getAccount(id);
    });
  }

  /// Update the current account
  Future<void> updateCurrentAccount({
    // Pass specific fields to align with AccountService.updateAccount
    String? refreshToken,
    String? accessToken,
    int? expiresAt,
    String? tokenType,
    String? scope,
    String? idToken,
    String? sessionState,
    bool? isActive,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      // AccountService.updateAccount returns the updated Account.
      final updatedAccount =
          await ref.read(accountServiceProvider).updateAccount(
                id: id, // Use the 'id' from the provider's family parameter
                refreshToken: refreshToken,
                accessToken: accessToken,
                expiresAt: expiresAt,
                tokenType: tokenType,
                scope: scope,
                idToken: idToken,
                sessionState: sessionState,
                isActive: isActive,
              );
      state =
          AsyncValue.data(updatedAccount); // Use the returned account directly
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Account?>) {
        state =
            AsyncError<Account?>(e, st).copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }

  /// Delete the current account
  Future<void> delete() async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      // AccountService.deleteAccount completes successfully or throws.
      // Use the 'id' from the provider's family parameter
      await ref.read(accountServiceProvider).deleteAccount(id);
      state = const AsyncValue.data(null); // Set state to null after deletion
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Account?>) {
        state =
            AsyncError<Account?>(e, st).copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }
}
