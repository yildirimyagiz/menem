import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/agent.dart';
import '../services/agent_service.dart'; // Import AgentService
import 'api_provider.dart'; // To provide ApiService for AgentService

part 'agent_provider.g.dart';

// Provider for AgentService
@riverpod
// ignore: deprecated_member_use
AgentService agentService(AutoDisposeProviderRef<AgentService> ref) {
  return AgentService(ref.watch(apiServiceProvider));
}

@riverpod
class AgentNotifier extends _$AgentNotifier {
  @override
  FutureOr<List<Agent>> build() async {
    // AgentService.getAgents returns PaginatedResponse<Agent>.
    // We'll fetch the first page here. UI might need pagination controls.
    final paginatedResponse = await ref.read(agentServiceProvider).getAgents();
    return paginatedResponse.data;
  }

  /// Refresh the list of all agents
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () async {
        final paginatedResponse =
            await ref.read(agentServiceProvider).getAgents();
        return paginatedResponse.data;
      },
    );
  }

  /// Fetch agents by agency ID
  Future<void> getByAgency(String agencyId) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () async {
        // AgentService.getAgents can filter by agencyId
        final paginatedResponse =
            await ref.read(agentServiceProvider).getAgents(agencyId: agencyId);
        return paginatedResponse.data;
      },
    );
  }

  /// Create a new agent
  Future<void> createAgent({
    required String name,
    String? email,
    String? phone,
    String? agencyId,
  }) async {
    // final previousState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(agentServiceProvider).createAgent(
            name: name,
            email: email,
            phone: phone,
            agencyId: agencyId,
          );
      await refresh(); // Refresh is generally safer for create
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      // if (previousState.hasValue) state = previousState;
    }
  }

  /// Update an existing agent
  Future<void> updateAgent({
    required String id,
    String? name,
    String? email,
    String? phone,
    String? agencyId,
  }) async {
    final currentAgents = state.valueOrNull;
    state = const AsyncValue.loading();
    try {
      final updatedAgent = await ref.read(agentServiceProvider).updateAgent(
          id: id, name: name, email: email, phone: phone, agencyId: agencyId);
      if (currentAgents != null) {
        state = AsyncValue.data(currentAgents
            .map<Agent>((Agent agent) =>
                agent.id == updatedAgent.id ? updatedAgent : agent)
            .toList());
      } else {
        await refresh();
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (currentAgents != null) state = AsyncValue.data(currentAgents);
    }
  }

  /// Delete an agent
  Future<void> deleteAgent(String id) async {
    final currentAgents = state.valueOrNull;
    state = const AsyncValue.loading();
    try {
      await ref.read(agentServiceProvider).deleteAgent(id);
      if (currentAgents != null) {
        state = AsyncValue.data(
            currentAgents.where((Agent agent) => agent.id != id).toList());
      } else {
        await refresh();
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (currentAgents != null) state = AsyncValue.data(currentAgents);
    }
  }
}

@riverpod
class AgentDetailNotifier extends _$AgentDetailNotifier {
  @override
  FutureOr<Agent?> build(String id) async {
    return ref.read(agentServiceProvider).getAgent(id);
  }

  /// Refresh the detail for the current agent
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // 'id' is the family parameter passed to build and accessible here
      return ref.read(agentServiceProvider).getAgent(id);
    });
  }

  /// Update the current agent
  Future<void> updateAgent({
    // Parameters should match AgentService.updateAgent
    String? name,
    String? email,
    String? phone,
    String? agencyId,
  }) async {
    // 'id' is the family parameter
    if (state.valueOrNull == null) return; // No agent loaded to update

    state = const AsyncValue.loading();
    try {
      final updatedAgent = await ref.read(agentServiceProvider).updateAgent(
          id: id, // id comes from the family parameter
          name: name,
          email: email,
          phone: phone,
          agencyId: agencyId);
      state = AsyncValue.data(updatedAgent);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Delete the current agent
  Future<void> delete() async {
    // 'id' is the family parameter
    if (state.valueOrNull == null) return; // No agent loaded to delete

    state = const AsyncValue.loading();
    try {
      await ref.read(agentServiceProvider).deleteAgent(id);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
