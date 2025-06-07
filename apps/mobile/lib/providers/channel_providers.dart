import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/channel.dart';
// To handle paginated responses
import '../services/channel_service.dart'; // Import ChannelService
import 'api_provider.dart'; // To provide ApiService for ChannelService

part 'channel_providers.g.dart';

// Provider for ChannelService
@riverpod
// ignore: deprecated_member_use_from_same_package
ChannelService channelService(ChannelServiceRef ref) {
  return ChannelService(ref.watch(apiServiceProvider));
}

@riverpod
class ChannelNotifier extends _$ChannelNotifier {
  @override
  FutureOr<List<Channel>> build() async {
    // Assuming ChannelService.getChannels returns PaginatedResponse<Channel>
    final paginatedResponse = await ref
        .read(channelServiceProvider)
        .getChannels(type: '', status: '', memberId: '');
    return paginatedResponse.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final paginatedResponse = await ref
          .read(channelServiceProvider)
          .getChannels(type: '', status: '', memberId: '');
      return paginatedResponse.data;
    });
  }

  Future<void> getByType(String type) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // Assuming getChannels can filter by type and returns PaginatedResponse<Channel>
      final paginatedResponse = await ref
          .read(channelServiceProvider)
          .getChannels(type: type, status: '', memberId: '');
      return paginatedResponse.data;
    });
  }

  Future<void> getByStatus(String status) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // Assuming getChannels can filter by status and returns PaginatedResponse<Channel>
      final paginatedResponse = await ref
          .read(channelServiceProvider)
          .getChannels(status: status, type: '', memberId: '');
      return paginatedResponse.data;
    });
  }

  Future<void> getByMember(String memberId) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      // Assuming getChannels can filter by memberId and returns PaginatedResponse<Channel>
      final paginatedResponse = await ref
          .read(channelServiceProvider)
          .getChannels(memberId: memberId, type: '', status: '');
      return paginatedResponse.data;
    });
  }

  /// Create a new channel
  Future<void> createChannel({
    required String name,
    required String type, // Example: 'public', 'private', 'direct'
    String? description,
    List<String>? memberIds, // Example: list of user IDs to add as members
  }) async {
    final previousState = state;
    state = const AsyncValue.loading();
    try {
      // Assuming ChannelService.createChannel takes specific parameters
      await ref.read(channelServiceProvider).createChannel(
            name: name,
            type: type,
            description: description,
            memberIds: memberIds,
          );
      await refresh(); // Refresh the list after creation
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
    }
  }

  /// Update an existing channel
  Future<void> updateChannel({
    required String id,
    String? name,
    String? type,
    String? description,
    List<String>? memberIds,
    // Add other updatable fields as needed
  }) async {
    final currentData = state.valueOrNull;
    final previousState = state;
    state = const AsyncValue.loading();
    try {
      // Assuming ChannelService.updateChannel returns the updated Channel.
      final updatedChannel =
          await ref.read(channelServiceProvider).updateChannel(
                id: id,
                name: name,
                type: type,
                description: description,
                memberIds: memberIds,
              );

      if (currentData != null) {
        state = AsyncValue.data(
          currentData
              .map((ch) => ch.id == updatedChannel.id ? updatedChannel : ch)
              .toList(),
        );
      } else {
        await refresh(); // Fallback if no current data to update
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
    }
  }

  /// Delete a channel
  Future<void> deleteChannel(String id) async {
    final currentData = state.valueOrNull;
    final previousState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(channelServiceProvider).deleteChannel(id);
      if (currentData != null) {
        state =
            AsyncValue.data(currentData.where((ch) => ch.id != id).toList());
      } else {
        await refresh(); // Fallback if no current data
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
    }
  }
}

@riverpod
class ChannelDetailNotifier extends _$ChannelDetailNotifier {
  @override
  FutureOr<Channel?> build(String id) async {
    // Returning Channel? to allow null state after deletion
    // Assuming ChannelService.getChannel returns Future<Channel> and throws if not found.
    // Riverpod will handle the Future and place it in AsyncData or AsyncError.
    // If getChannel itself can return null for "not found", this is also fine.
    // For consistency with AccountDetailNotifier, we expect getChannel to return Future<Channel>
    // and throw an error for not found, which is then caught by UI or remains AsyncError.
    // The `Channel?` return type here is mainly to support the `AsyncValue.data(null)` after deletion.
    return ref.read(channelServiceProvider).getChannel(id);
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
        () => ref.read(channelServiceProvider).getChannel(id));
  }

  /// Update the current channel
  Future<void> updateCurrentChannel({
    // Pass specific fields that can be updated for a channel
    String? name,
    String? type,
    String? description,
    List<String>? memberIds,
    // Add other updatable fields as needed
  }) async {
    state = const AsyncValue.loading();
    try {
      // Assuming ChannelService.updateChannel returns the updated Channel.
      // Use the 'id' from the provider's family parameter.
      final updatedChannel =
          await ref.read(channelServiceProvider).updateChannel(
                id: id, // Use the 'id' from the provider's family parameter
                name: name,
                type: type,
                description: description,
                memberIds: memberIds,
              );
      state = AsyncValue.data(updatedChannel);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Delete the current channel
  Future<void> deleteCurrentChannel() async {
    state = const AsyncValue.loading();
    try {
      await ref.read(channelServiceProvider).deleteChannel(id);
      state = const AsyncValue.data(null); // Set state to null after deletion
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
