// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$locationServiceHash() => r'0f856806eb02b644605f3f94baeb94949df0a4dd';

/// See also [locationService].
@ProviderFor(locationService)
final locationServiceProvider = AutoDisposeProvider<LocationService>.internal(
  locationService,
  name: r'locationServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$locationServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef LocationServiceRef = AutoDisposeProviderRef<LocationService>;
String _$locationNotifierHash() => r'45ccd90a4c5af8f20f3b53d4674a3cd5a1ba7480';

/// See also [LocationNotifier].
@ProviderFor(LocationNotifier)
final locationNotifierProvider =
    AutoDisposeAsyncNotifierProvider<LocationNotifier, List<Location>>.internal(
  LocationNotifier.new,
  name: r'locationNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$locationNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$LocationNotifier = AutoDisposeAsyncNotifier<List<Location>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
