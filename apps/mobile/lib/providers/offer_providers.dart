import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';
import 'dart:developer';
import '../models/offer.dart';
import '../services/offer_service.dart';
import 'api_provider.dart';

/// Provider for OfferService
final offerServiceProvider = Provider<OfferService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return OfferService(apiService);
});

class OfferNotifier extends StateNotifier<AsyncValue<List<Offer>>> {
  final OfferService _offerService;

  OfferNotifier(this._offerService) : super(const AsyncValue.loading()) {
    _loadOffers();
  }

  Future<void> _loadOffers() async {
    state = const AsyncValue.loading();
    try {
      final offers = await _offerService.getAll();
      state = AsyncValue.data(offers);
      if (offers.isNotEmpty) {
        log('Loaded ${offers.length} offers');
      } else {
        log('No offers found');
      }
    } catch (e, st) {
      log('Error loading offers: $e', error: e, stackTrace: st);
      state = AsyncValue.error(e, st);
    }
  }

  /// Refresh the list of all offers
  Future<void> refresh() async {
    await _loadOffers();
  }

  /// Get offers by status
  Future<void> getByStatus(String status) async {
    state = const AsyncValue.loading();
    try {
      final offers = await _offerService.getOffersByStatus(status);
      state = AsyncValue.data(offers);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Get offers by property ID
  Future<void> getByProperty(String propertyId) async {
    state = const AsyncValue.loading();
    try {
      final offers = await _offerService.getOffersByProperty(propertyId);
      state = AsyncValue.data(offers);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

class OfferDetailNotifier extends StateNotifier<AsyncValue<Offer?>> {
  final OfferService _offerService;
  final String id;

  OfferDetailNotifier(this._offerService, this.id)
      : super(const AsyncValue.loading()) {
    if (id.isNotEmpty) {
      _loadOffer();
    } else {
      state = const AsyncValue.data(null);
    }
  }

  Future<void> _loadOffer() async {
    state = const AsyncValue.loading();
    try {
      final offer = await _offerService.get(id);
      state = AsyncValue.data(offer);
      log('Loaded offer: ${offer?.id}');
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Refresh the current offer
  Future<void> refresh() async {
    await _loadOffer();
  }
}

/// Provider for the list of offers
final offersProvider =
    StateNotifierProvider<OfferNotifier, AsyncValue<List<Offer>>>((ref) {
  final offerService = ref.watch(offerServiceProvider);
  return OfferNotifier(offerService);
});

/// Provider for a single offer detail
final offerDetailProvider = StateNotifierProvider.family<OfferDetailNotifier,
    AsyncValue<Offer?>, String>((ref, id) {
  final offerService = ref.watch(offerServiceProvider);
  return OfferDetailNotifier(offerService, id);
});
