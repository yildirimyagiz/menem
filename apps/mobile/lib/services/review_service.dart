import 'package:mobile/models/review.dart';
import 'dart:developer';
import 'package:mobile/api/api_service.dart';
import 'package:mobile/models/pagination.dart'; // For PaginatedResponse

/// Custom exception for review-related errors.
class ReviewException implements Exception {
  final String message;
  ReviewException(this.message);
  @override
  String toString() => 'ReviewException: $message';
}

/// Service for handling review-related API operations via TRPC.
class ReviewService {
  final ApiService _apiService;

  ReviewService(this._apiService);

  /// Fetches all reviews (optionally filtered).
  /// Corresponds to `review.all` tRPC procedure.
  Future<PaginatedResponse<Review>> getReviews({
    int page = 1,
    int pageSize = 10,
    Map<String, dynamic>? filters, // To match ReviewFilterSchema
  }) async {
    try {
      final params = {'page': page, 'pageSize': pageSize, ...(filters ?? {})};
      final response = await _apiService.query('review.all', params);

      return PaginatedResponse<Review>.fromJson(
        response as Map<String, dynamic>,
        (json) => Review.fromJson(json as Map<String, dynamic>),
        dataKey: 'data', // Backend returns { data: [...], pagination: {...} }
      );
    } catch (e, st) {
      _logError('getReviews', e, st);
      throw ReviewException('Failed to get reviews: $e');
    }
  }

  /// Fetches a single review by ID.
  /// Corresponds to `review.byId` tRPC procedure.
  Future<Review?> getReviewById(String id) async {
    try {
      final response = await _apiService.query('review.byId', {'id': id});
      if (response == null) {
        return null; // Or throw specific "Not Found" ReviewException
      }
      return Review.fromJson(response);
    } catch (e, st) {
      _logError('getReviewById', e, st);
      if (e.toString().contains('NOT_FOUND')) return null;
      throw ReviewException('Failed to get review by ID $id: $e');
    }
  }

  /// Creates a new review.
  /// `data` should match `CreateReviewSchema`.
  Future<Review> createReview(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.mutation('review.create', data);
      if (response == null) {
        throw ReviewException('No data returned from createReview');
      }
      return Review.fromJson(response);
    } catch (e, st) {
      _logError('createReview', e, st);
      // Consider more specific error handling based on backend response
      throw ReviewException('Failed to create review: $e');
    }
  }

  /// Updates an existing review by ID.
  /// `data` should match `UpdateReviewSchema` and include 'id'.
  Future<Review> updateReview(Map<String, dynamic> data) async {
    try {
      // Ensure 'id' is present in the data map
      if (!data.containsKey('id')) {
        throw ArgumentError('Review ID must be provided for update.');
      }
      final response = await _apiService.mutation('review.update', data);
      if (response == null) {
        throw ReviewException('No data returned from updateReview');
      }
      return Review.fromJson(response);
    } catch (e, st) {
      _logError('updateReview', e, st);
      throw ReviewException('Failed to update review: $e');
    }
  }

  /// Deletes a review by ID.
  /// Corresponds to `review.delete` tRPC procedure (soft delete).
  Future<void> deleteReview(String id) async {
    try {
      await _apiService.mutation('review.delete', {'id': id});
    } catch (e, st) {
      _logError('deleteReview', e, st);
      throw ReviewException('Failed to delete review: $e');
    }
  }

  void _logError(String method, Object error, StackTrace st) {
    log('[ReviewService][$method] $error', error: error, stackTrace: st);
  }
}
