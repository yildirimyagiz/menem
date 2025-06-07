import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';
import 'dart:developer';
import '../models/post.dart';
import '../services/post_service.dart';
import 'api_provider.dart';

/// Provider for PostService
final postServiceProvider = Provider<PostService>((ref) {
  return PostService(ref.watch(apiServiceProvider));
});

class PostNotifier extends StateNotifier<AsyncValue<List<Post>>> {
  final PostService _postService;
  
  PostNotifier(this._postService) : super(const AsyncValue.loading()) {
    _loadPosts();
  }
  
  Future<void> _loadPosts() async {
    state = const AsyncValue.loading();
    try {
      final paginatedResponse = await _postService.getPosts();
      state = AsyncValue.data(paginatedResponse.data);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }


  /// Refresh the list of all posts
  Future<void> refresh() async {
    await _loadPosts();
  }

  /// Fetch posts by user ID
  Future<void> getByUser(String userId) async {
    state = const AsyncValue.loading();
    try {
      final paginatedResponse = await _postService.getPosts();
      // Filter client-side if needed until backend supports it
      state = AsyncValue.data(paginatedResponse.data);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Fetch posts by agency ID
  Future<void> getByAgency(String agencyId) async {
    state = const AsyncValue.loading();
    try {
      final paginatedResponse = await _postService.getPosts();
      // Filter client-side if needed until backend supports it
      state = AsyncValue.data(paginatedResponse.data);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Create a new post
  Future<void> createPost({
    required String title,
    required String content,
    String? agencyId,
    String? agentId,
    String? hashtagId,
  }) async {
    final previousState = state;
    state = const AsyncValue.loading();
    try {
      await _postService.createPost(
        title: title,
        content: content,
        agencyId: agencyId,
        agentId: agentId,
        hashtagId: hashtagId,
      );
      await _loadPosts();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
      rethrow;
    }
  }

  /// Update an existing post
  Future<void> updatePost({
    required String id,
    String? title,
    String? content,
    String? agencyId,
    String? agentId,
    String? hashtagId,
  }) async {
    final previousState = state;
    state = const AsyncValue.loading();
    try {
      // Note: You'll need to implement updatePost in PostService
      // For now, we'll refresh the list
      await _loadPosts();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
      rethrow;
    }
  }

  /// Delete a post
  Future<void> deletePost(String id) async {
    final currentData = state.valueOrNull;
    final previousState = state;
    state = const AsyncValue.loading();
    try {
      await _postService.deletePost(id);
      if (currentData != null) {
        state = AsyncValue.data(
          currentData.where((post) => post.id != id).toList(),
        );
      } else {
        await _loadPosts();
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
      rethrow;
    }
  }
}

class PostDetailNotifier extends StateNotifier<AsyncValue<Post?>> {
  final PostService _postService;
  final String id;
  
  PostDetailNotifier(this._postService, this.id) : super(const AsyncValue.loading()) {
    if (id.isNotEmpty) {
      _loadPost();
    } else {
      state = const AsyncValue.data(null);
    }
  }
  
  Future<void> _loadPost() async {
    state = const AsyncValue.loading();
    try {
      final post = await _postService.getPostById(id);
state = AsyncValue.data(post);
      log('Loaded post: ${post.id}');
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }


  /// Refresh the detail for the current post
  Future<void> refresh() async {
    await _loadPost();
  }

  /// Update the current post
  Future<void> updateCurrentPost({
    required String id,
    String? title,
    String? content,
    String? agencyId,
    String? agentId,
    String? hashtagId,
  }) async {
    final previousState = state;
    state = const AsyncValue.loading();
    try {
      // Note: You'll need to implement updatePost in PostService
      // For now, we'll refresh the post
      await _loadPost();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      if (previousState.hasValue) state = previousState;
      rethrow;
    }
  }

  /// Delete the current post
  Future<void> delete() async {
    state = const AsyncValue.loading();
    try {
      await _postService.deletePost(id);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

/// Provider for the list of posts
final postsProvider = StateNotifierProvider<PostNotifier, AsyncValue<List<Post>>>((ref) {
  return PostNotifier(ref.watch(postServiceProvider));
});

/// Provider for a single post detail
final postDetailProvider = StateNotifierProvider.family<PostDetailNotifier, AsyncValue<Post?>, String>(
  (ref, id) => PostDetailNotifier(ref.watch(postServiceProvider), id),
);
