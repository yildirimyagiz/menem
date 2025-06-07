// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reservation_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$reservationServiceHash() =>
    r'adcd952a3ae46a236d3dc419dde5655724137464';

/// See also [reservationService].
@ProviderFor(reservationService)
final reservationServiceProvider =
    AutoDisposeProvider<ReservationService>.internal(
  reservationService,
  name: r'reservationServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reservationServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ReservationServiceRef = AutoDisposeProviderRef<ReservationService>;
String _$reservationsNotifierHash() =>
    r'62115476dfe057db4a66e8fd05aea58a00d4b1ca';

/// See also [ReservationsNotifier].
@ProviderFor(ReservationsNotifier)
final reservationsNotifierProvider = AutoDisposeAsyncNotifierProvider<
    ReservationsNotifier, List<Reservation>>.internal(
  ReservationsNotifier.new,
  name: r'reservationsNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reservationsNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ReservationsNotifier = AutoDisposeAsyncNotifier<List<Reservation>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
