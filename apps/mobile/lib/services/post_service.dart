import 'dart:developer';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/post.dart'; // Assuming you have a Post model
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for post-related errors.
class PostException implements Exception {
  final String message;
  final String? code; // Optional: for specific error codes from backend

  PostException(this.message, {this.code});

  @override
  String toString() =>
      'PostException: $message${code != null ? ' (Code: $code)' : ''}';
}

/// Service for handling post-related API operations via TRPC.
class PostService {
  final ApiService _apiService;

  PostService(this._apiService);

  /// Fetches all posts with pagination.
  Future<PaginatedResponse<Post>> getPosts({
    int page = 1,
    int limit = 10,
    // Add any filter parameters your backend 'post.all' might support
    // String? userId,
    // String? hashtagId,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
        // if (userId != null) 'userId': userId,
        // if (hashtagId != null) 'hashtagId': hashtagId,
      };
      final response = await _apiService.query('post.all', params);
      if (response == null) {
        throw PostException('No data returned from getPosts');
      }
      return PaginatedResponse<Post>.fromJson(
        response as Map<String, dynamic>,
        (json) => Post.fromJson(json as Map<String, dynamic>),
        dataKey: 'data',
      );
    } catch (e, st) {
      _logError('getPosts', e, st);
      throw PostException('Failed to get posts: $e');
    }
  }

  /// Fetches a single post by ID.
  Future<Post> getPostById(String id) async {
    try {
      final response = await _apiService.query('post.byId', {'id': id});
      if (response == null) {
        throw PostException('No data returned from getPostById',
            code: 'NOT_FOUND');
      }
      return Post.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('getPostById', e, st);
      if (e.toString().contains('NOT_FOUND')) {
        throw PostException('Post not found with ID: $id', code: 'NOT_FOUND');
      }
      throw PostException('Failed to get post by ID $id: $e');
    }
  }

  /// Creates a new post.
  /// `data` should match the `CreatePostSchema` on your backend.
  Future<Post> createPost({
    required String title,
    required String content,
    String? agencyId,
    String? agentId,
    String? hashtagId,
  }) async {
    try {
      final Map<String, dynamic> postData = {
        'title': title,
        'content': content,
        if (agencyId != null) 'agencyId': agencyId,
        if (agentId != null) 'agentId': agentId,
        if (hashtagId != null) 'hashtagId': hashtagId,
      };
      final response = await _apiService.mutation('post.create', postData);
      if (response == null) {
        throw PostException('No data returned from createPost');
      }
      return Post.fromJson(response as Map<String, dynamic>);
    } catch (e, st) {
      _logError('createPost', e, st);
      throw PostException('Failed to create post: $e');
    }
  }

  /// Deletes a post by its ID.
  Future<void> deletePost(String id) async {
    try {
      await _apiService.mutation('post.delete', {'id': id});
    } catch (e, st) {
      _logError('deletePost', e, st);
      throw PostException('Failed to delete post $id: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[PostService][$method] $error', error: error, stackTrace: st);
  }

  Future<void> updatePost(
      {required String id,
      String? title,
      String? content,
      String? agencyId,
      String? agentId,
      String? hashtagId}) async {}
}
