// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'increase_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$increaseServiceHash() => r'0b0ee1c3d7c3abcc1685bb05e49d1b9e58da3cc1';

/// See also [increaseService].
@ProviderFor(increaseService)
final increaseServiceProvider = AutoDisposeProvider<IncreaseService>.internal(
  increaseService,
  name: r'increaseServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$increaseServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef IncreaseServiceRef = AutoDisposeProviderRef<IncreaseService>;
String _$increaseNotifierHash() => r'2b5689148ad85798247b4a16f852fd63201bd638';

/// See also [IncreaseNotifier].
@ProviderFor(IncreaseNotifier)
final increaseNotifierProvider =
    AutoDisposeAsyncNotifierProvider<IncreaseNotifier, List<Increase>>.internal(
  IncreaseNotifier.new,
  name: r'increaseNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$increaseNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$IncreaseNotifier = AutoDisposeAsyncNotifier<List<Increase>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
