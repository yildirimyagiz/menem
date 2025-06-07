import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/favorite.dart';
import '../services/favorite_service.dart';
import 'api_providers.dart';

part 'favorite_provider.g.dart';

@riverpod
// ignore: deprecated_member_use_from_same_package
FavoriteService favoriteService(FavoriteServiceRef ref) {
  return FavoriteService(ref.watch(apiServiceProvider));
}

@riverpod
class FavoriteNotifier extends _$FavoriteNotifier {
  late final FavoriteService _favoriteService;

  @override
  Future<List<Favorite>> build() async {
    _favoriteService = ref.watch(favoriteServiceProvider);
    final response = await _favoriteService.getFavorites(
      sortBy: 'createdAt',
      sortOrder: 'desc',
    );
    return response.data;
  }

  Future<List<Favorite>> _getFavorites() async {
    try {
      final response = await _favoriteService.getFavorites(
        sortBy: 'createdAt',
        sortOrder: 'desc',
      );
      return response.data;
    } catch (e, st) {
      debugPrint('Error getting favorites: $e\n$st');
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_getFavorites);
  }

  Future<void> toggleFavorite(String propertyId) async {
    try {
      state = const AsyncValue.loading();
      // You might want to get the current user ID from auth provider
      // final userId = ref.read(authProvider).user?.id;
      // if (userId == null) throw Exception('User not authenticated');

      await _favoriteService.toggleFavorite(
        // userId: userId,
        userId: 'current-user-id', // Replace with actual user ID
        propertyId: propertyId,
      );

      // Refresh the list after toggling
      await refresh();
    } catch (e, st) {
      debugPrint('Error toggling favorite: $e\n$st');
      rethrow;
    }
  }

  Future<bool> isFavorite(String propertyId) async {
    try {
      // You might want to get the current user ID from auth provider
      // final userId = ref.read(authProvider).user?.id;
      // if (userId == null) return false;

      final favorite = await _favoriteService.getFavoriteByUserAndProperty(
        // userId: userId,
        userId: 'current-user-id', // Replace with actual user ID
        propertyId: propertyId,
      );

      return favorite != null;
    } catch (e, st) {
      debugPrint('Error checking favorite status: $e\n$st');
      return false;
    }
  }

  Future<void> clearAllFavorites() async {
    try {
      state = const AsyncValue.loading();
      await _favoriteService.clearAllFavorites();
      await refresh();
    } catch (e, st) {
      debugPrint('Error clearing favorites: $e\n$st');
      rethrow;
    }
  }

  void removeFavorite(String id) {}
}
