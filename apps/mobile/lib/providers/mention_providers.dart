import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/mention.dart';
import '../services/mention_service.dart';
import 'api_providers.dart';

part 'mention_providers.g.dart';

@riverpod
MentionService mentionService(Ref ref) {
  return MentionService(ref.watch(apiServiceProvider));
}

@riverpod
class MentionNotifier extends _$MentionNotifier {
  late final MentionService _mentionService;

  @override
  Future<List<Mention>> build() async {
    _mentionService = ref.watch(mentionServiceProvider);
    final response = await _mentionService.getMentions();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await _mentionService.getMentions();
      return response.data;
    });
  }

  Future<Mention> markAsRead(String mentionId) async {
    try {
      // Use updateMention to mark as read
      final updatedMention = await _mentionService.updateMention(
        id: mentionId,
        isRead: true,
      );
      
      // Update the state to reflect the change
      if (state.hasValue) {
        final mentions = List<Mention>.from(state.value!);
        final index = mentions.indexWhere((m) => m.id == mentionId);
        if (index != -1) {
          mentions[index] = updatedMention;
          state = AsyncValue.data(mentions);
        }
      }
      
      return updatedMention;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<List<Mention>> markAllAsRead() async {
    try {
      // First get all unread mentions
      final unreadMentions = state.value?.where((m) => !m.isRead).toList() ?? [];
      
      // Mark each unread mention as read
      final updatedMentions = <Mention>[];
      for (final mention in unreadMentions) {
        try {
          final updated = await _mentionService.updateMention(
            id: mention.id,
            isRead: true,
          );
          updatedMentions.add(updated);
        } catch (e) {
          // Log error but continue with other mentions
          debugPrint('Error marking mention ${mention.id} as read: $e');
        }
      }
      
      // Update the state to reflect the changes
      if (state.hasValue) {
        final mentions = List<Mention>.from(state.value!);
        for (var i = 0; i < mentions.length; i++) {
          if (!mentions[i].isRead) {
            mentions[i] = mentions[i].copyWith(isRead: true);
          }
        }
        state = AsyncValue.data(mentions);
      }
      
      return updatedMentions;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}
