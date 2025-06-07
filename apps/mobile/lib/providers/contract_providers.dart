import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';
import 'dart:developer';
import '../models/contract.dart';
import '../services/contract_service.dart';
import 'api_provider.dart';

/// Provider for ContractService
final contractServiceProvider = Provider<ContractService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ContractService(apiService: apiService);
});

class ContractNotifier extends StateNotifier<AsyncValue<List<Contract>>> {
  final ContractService _contractService;

  ContractNotifier(this._contractService) : super(const AsyncValue.loading()) {
    _loadContracts();
  }

  Future<void> _loadContracts() async {
    state = const AsyncValue.loading();
    try {
      final contracts = await _contractService.getAll();
      state = AsyncValue.data(contracts);
      if (contracts.isNotEmpty) {
        log('Loaded ${contracts.length} contracts');
      } else {
        log('No contracts found');
      }
    } catch (e, st) {
      log('Error loading contracts: $e', error: e, stackTrace: st);
      state = AsyncValue.error(e, st);
    }
  }

  /// Refresh the list of all contracts
  Future<void> refresh() async {
    await _loadContracts();
  }

  /// Get contracts by user ID
  Future<void> getByUser(String userId) async {
    state = const AsyncValue.loading();
    try {
      final contracts = await _contractService.getContractsByUser(userId);
      state = AsyncValue.data(contracts);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Create a new contract
  Future<void> createContract(Contract contract) async {
    state = const AsyncValue.loading();
    try {
      await _contractService.create(contract.toJson());
      await _loadContracts(); // Refresh the list
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  /// Update an existing contract
  Future<void> updateContract(String id, Map<String, dynamic> data) async {
    state = const AsyncValue.loading();
    try {
      await _contractService.update(id, data);
      await _loadContracts(); // Refresh the list
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  /// Delete a contract
  Future<void> deleteContract(String id) async {
    state = const AsyncValue.loading();
    try {
      await _contractService.delete(id);
      await _loadContracts(); // Refresh the list
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

class ContractDetailNotifier extends StateNotifier<AsyncValue<Contract?>> {
  final ContractService _contractService;
  final String id;

  ContractDetailNotifier(this._contractService, this.id)
      : super(const AsyncValue.loading()) {
    if (id.isNotEmpty) {
      _loadContract();
    } else {
      state = const AsyncValue.data(null);
    }
  }

  Future<void> _loadContract() async {
    state = const AsyncValue.loading();
    try {
      final contract = await _contractService.get(id);
      state = AsyncValue.data(contract);
      if (contract != null) {
        log('Loaded contract: ${contract.id}');
      }
    } catch (e, st) {
      log('Error loading contract: $e', error: e, stackTrace: st);
      state = AsyncValue.error(e, st);
    }
  }

  /// Refresh the current contract
  Future<void> refresh() async {
    await _loadContract();
  }

  /// Update the current contract
  Future<void> updateContract(Map<String, dynamic> data) async {
    if (state.value == null) return;

    state = const AsyncValue.loading();
    try {
      await _contractService.update(id, data);
      await _loadContract(); // Refresh the contract data
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  /// Delete the current contract
  Future<void> delete() async {
    if (state.value == null) return;

    state = const AsyncValue.loading();
    try {
      await _contractService.delete(id);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

/// Provider for the list of contracts
final contractsProvider =
    StateNotifierProvider<ContractNotifier, AsyncValue<List<Contract>>>((ref) {
  final contractService = ref.watch(contractServiceProvider);
  return ContractNotifier(contractService);
});

/// Provider for a single contract detail
final contractDetailProvider = StateNotifierProvider.family<
    ContractDetailNotifier, AsyncValue<Contract?>, String>(
  (ref, id) {
    final contractService = ref.watch(contractServiceProvider);
    return ContractDetailNotifier(contractService, id);
  },
);
