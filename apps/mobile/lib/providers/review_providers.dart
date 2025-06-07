import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/review.dart';
import '../services/review_service.dart';
import 'api_provider.dart';

part 'review_providers.g.dart';

@riverpod
// ignore: deprecated_member_use_from_same_package
ReviewService reviewService(ReviewServiceRef ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ReviewService(apiService);
}

@riverpod
class ReviewNotifier extends _$ReviewNotifier {
  @override
  FutureOr<List<Review>> build() async {
    final response = await ref.read(reviewServiceProvider).getReviews();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(reviewServiceProvider).getReviews();
      return response.data;
    });
  }

  /// Fetch reviews with optional filters
  Future<void> fetchReviews({
    int page = 1,
    int pageSize = 10,
    Map<String, dynamic>? filters,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(reviewServiceProvider).getReviews(
            page: page,
            pageSize: pageSize,
            filters: filters,
          );
      return response.data;
    });
  }

  /// Create a new review
  Future<void> createReview({
    required String userId,
    required String title,
    required String content,
    required int rating,
    String? agentId,
    String? agencyId,
    String? propertyId,
    String? parentReviewId,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final reviewData = {
        'userId': userId,
        'title': title,
        'content': content,
        'rating': rating,
        if (agentId != null) 'agentId': agentId,
        if (agencyId != null) 'agencyId': agencyId,
        if (propertyId != null) 'propertyId': propertyId,
        if (parentReviewId != null) 'parentReviewId': parentReviewId,
      };

      await ref.read(reviewServiceProvider).createReview(reviewData);
      await refresh();
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Review>>) {
        state = AsyncError<List<Review>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
      rethrow;
    }
  }

  /// Update an existing review
  Future<void> updateReview({
    required String id,
    String? title,
    String? content,
    int? rating,
    bool? isEdited,
  }) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      final reviewData = {
        'id': id,
        if (title != null) 'title': title,
        if (content != null) 'content': content,
        if (rating != null) 'rating': rating,
        if (isEdited != null) 'isEdited': isEdited,
      };

      final updatedReview =
          await ref.read(reviewServiceProvider).updateReview(reviewData);

      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state = AsyncValue.data(
          currentData
              .map((rev) => rev.id == updatedReview.id ? updatedReview : rev)
              .toList(),
        );
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Review>>) {
        state = AsyncError<List<Review>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
      rethrow;
    }
  }

  /// Delete a review
  Future<void> deleteReview(String id) async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(reviewServiceProvider).deleteReview(id);
      final currentData = previousAsyncState.valueOrNull;
      if (currentData != null) {
        state = AsyncValue.data(
          currentData.where((rev) => rev.id != id).toList(),
        );
      } else {
        await refresh();
      }
    } catch (e, st) {
      if (previousAsyncState is AsyncData<List<Review>>) {
        state = AsyncError<List<Review>>(e, st)
            .copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
      rethrow;
    }
  }
}

@riverpod
class ReviewDetailNotifier extends _$ReviewDetailNotifier {
  @override
  FutureOr<Review?> build(String id) async {
    return ref.read(reviewServiceProvider).getReviewById(id);
  }

  Future<void> refresh() async {
    final id = state.value?.id;
    if (id == null) return;

    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(reviewServiceProvider).getReviewById(id),
    );
  }

  Future<void> updateReview(Map<String, dynamic> data) async {
    final id = state.value?.id;
    if (id == null) return;

    state = const AsyncValue.loading();
    try {
      await ref.read(reviewServiceProvider).updateReview({
        'id': id,
        ...data,
      });
      state = await AsyncValue.guard(
        () => ref.read(reviewServiceProvider).getReviewById(id),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  /// Delete the current review
  Future<void> deleteCurrentReview() async {
    final previousAsyncState = state;
    state = const AsyncValue.loading();
    try {
      await ref.read(reviewServiceProvider).deleteReview(id);
      state = const AsyncValue.data(null); // Set state to null after deletion
    } catch (e, st) {
      if (previousAsyncState is AsyncData<Review?>) {
        state = AsyncError<Review?>(e, st).copyWithPrevious(previousAsyncState);
      } else {
        state = AsyncValue.error(e, st);
      }
    }
  }
}
