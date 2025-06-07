import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/reservation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_provider.dart';
import '../services/reservation_service.dart';

part 'reservation_provider.g.dart';

@riverpod
ReservationService reservationService(Ref ref) {
  final apiService = ref.read(apiServiceProvider);
  return ReservationService(apiService);
}

@riverpod
class ReservationsNotifier extends _$ReservationsNotifier {
  @override
  FutureOr<List<Reservation>> build() async {
    final response = await ref.read(reservationServiceProvider).getReservations();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(reservationServiceProvider).getReservations();
      return response.data;
    });
  }

  Future<void> createReservation(Reservation reservation) async {
    await ref
        .read(reservationServiceProvider)
        .createReservation(reservation as Map<String, dynamic>);
    await refresh();
  }

  Future<void> updateReservation(Reservation reservation) async {
    await ref
        .read(reservationServiceProvider)
        .updateReservation(reservation as Map<String, dynamic>);
    await refresh();
  }

  Future<void> cancelReservation(String reservationId) async {
    await ref.read(reservationServiceProvider).cancelReservation(reservationId);
    await refresh();
  }

  Future<void> deleteReservation(String reservationId) async {
    await ref.read(reservationServiceProvider).deleteReservation(reservationId);
    await refresh();
  }
}
