import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/hashtag_service.dart';
import '../models/hashtag.dart';
import 'api_service_provider.dart';

final hashtagRepositoryProvider = Provider<HashtagService>((ref) {
  final apiService = ref.read(apiServiceProvider);
  return HashtagService(apiService);
});

final hashtagProvider =
    StateNotifierProvider<HashtagNotifier, AsyncValue<List<Hashtag>>>(
  (ref) => HashtagNotifier(ref),
);

class HashtagNotifier extends StateNotifier<AsyncValue<List<Hashtag>>> {
  final Ref ref;
  HashtagNotifier(this.ref) : super(const AsyncValue.loading()) {
    fetchAll();
  }
  Future<void> fetchAll() async {
    state = const AsyncValue.loading();
    try {
      final items = await ref.read(hashtagRepositoryProvider).getAllHashtags();
      state = AsyncValue.data(items);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<Hashtag?> fetchById(String id) async {
    try {
      return await ref.read(hashtagRepositoryProvider).getHashtag(id);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  Future<Hashtag?> createHashtag({
    required String name,
    // Add other required fields here
  }) async {
    try {
      final created = await ref
          .read(hashtagRepositoryProvider)
          .createHashtag(name: name, type: '');
      await fetchAll();
      return created;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  Future<Hashtag?> updateHashtag({
    required String id,
    String? name,
    // Add other updatable fields here
  }) async {
    try {
      final updated = await ref
          .read(hashtagRepositoryProvider)
          .updateHashtag(id: id, name: name);
      await fetchAll();
      return updated;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  Future<bool> deleteHashtag(String id) async {
    try {
      await ref.read(hashtagRepositoryProvider).deleteHashtag(id);
      await fetchAll();
      return true;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  Future<void> refresh() => fetchAll();
}
