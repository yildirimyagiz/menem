import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/models/property_filter.dart';
import 'package:mobile/models/property_form.dart';
import 'package:mobile/providers/api_providers.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/providers/favorite_provider.dart';
import 'package:mobile/services/property_service.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/property.dart';
import 'dart:async';

part 'property_provider.g.dart';

@riverpod
// ignore: deprecated_member_use_from_same_package
PropertyService propertyService(PropertyServiceRef ref) {
  final apiService = ref.watch(apiServiceProvider);
  return PropertyService(apiService);
}

@riverpod
class PropertyNotifier extends _$PropertyNotifier {
  @override
  FutureOr<List<Property>> build() async {
    return ref.read(propertyService as ProviderListenable).getProperties();
  }

  Future<void> refresh([PropertyFilter? filter]) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () =>
          ref.read(propertyService as ProviderListenable).getProperties(filter),
    );
  }

  Future<void> createProperty(PropertyForm form) async {
    state = const AsyncValue.loading();
    await ref.read(propertyService as ProviderListenable).createProperty(form);
    state = await AsyncValue.guard(
      () => ref.read(propertyService as ProviderListenable).getProperties(),
    );
  }

  Future<void> updateProperty(PropertyForm form) async {
    state = const AsyncValue.loading();
    await ref.read(propertyService as ProviderListenable).updateProperty(form);
    state = await AsyncValue.guard(
      () => ref.read(propertyService as ProviderListenable).getProperties(),
    );
  }

  Future<void> deleteProperty(String id) async {
    state = const AsyncValue.loading();
    await ref.read(propertyService as ProviderListenable).deleteProperty(id);
    state = await AsyncValue.guard(
      () => ref.read(propertyService as ProviderListenable).getProperties(),
    );
  }

  Future<Property> getProperty(String id) async {
    return ref.read(propertyService as ProviderListenable).getProperty(id);
  }

  Future<void> searchProperties(String query) async {
    state = const AsyncValue.loading();
    final properties =
        await ref.read(propertyService as ProviderListenable).getProperties();
    final filteredProperties = properties.data.where((property) {
      return property.title.toLowerCase().contains(query.toLowerCase()) ||
          (property.description?.toLowerCase().contains(query.toLowerCase()) ??
              false);
    }).toList();
    state = AsyncValue.data(filteredProperties);
  }

  Future<void> filterProperties({
    List<PropertyType>? types,
    List<PropertyStatus>? statuses,
    List<PropertyCategory>? categories,
  }) async {
    state = const AsyncValue.loading();
    final properties =
        await ref.read(propertyService as ProviderListenable).getProperties();
    final filteredProperties = properties.data.where((property) {
      if (types != null &&
          types.isNotEmpty &&
          !types.contains(property.propertyType)) {
        return false;
      }
      if (statuses != null &&
          statuses.isNotEmpty &&
          !statuses.contains(property.propertyStatus)) {
        return false;
      }
      if (categories != null &&
          categories.isNotEmpty &&
          !categories.contains(property.propertyType)) {
        return false;
      }
      return true;
    }).toList();
    state = AsyncValue.data(filteredProperties);
  }

  Future<void> toggleFavorite(String propertyId) async {
    try {
      state = await AsyncValue.guard(() async {
        final currentState = state.value ?? [];
        final propertyIndex =
            currentState.indexWhere((p) => p.id == propertyId);

        if (propertyIndex == -1) {
          throw Exception('Property not found');
        }

        final currentProperty = currentState[propertyIndex];
        final isFavorite = currentProperty.isFavorite;
        final favoriteService = ref.read(favoriteServiceProvider);
        final authNotifier = ref.read(authNotifierProvider.notifier);
        final userId = authNotifier.getUserId();

        if (userId == null) {
          throw Exception('User not authenticated');
        }

        if (isFavorite) {
          // Remove from favorites
          await favoriteService.deleteFavorite(propertyId);
        } else {
          // Add to favorites
          await favoriteService.createFavorite(
            userId: userId,
            propertyId: propertyId,
          );
        }

        // Update the favorite count
        final updatedProperty = currentProperty.copyWith(
          favoriteCount:
              (currentProperty.favoriteCount ?? 0) + (isFavorite ? -1 : 1),
          isFavorite: !isFavorite,
          deletedAt: isFavorite ? null : DateTime.now(),
        );

        // Update the state
        final newList = List<Property>.from(currentState);
        newList[propertyIndex] = updatedProperty;

        return newList;
      });
    } catch (e, stackTrace) {
      debugPrint('Error toggling favorite: $e\n$stackTrace');
      rethrow;
    }
  }
}
