// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'extra_charge_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$extraChargeServiceHash() =>
    r'43f2e92e362f20d9747c857527d2af89de56660f';

/// See also [extraChargeService].
@ProviderFor(extraChargeService)
final extraChargeServiceProvider =
    AutoDisposeProvider<ExtraChargeService>.internal(
  extraChargeService,
  name: r'extraChargeServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$extraChargeServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ExtraChargeServiceRef = AutoDisposeProviderRef<ExtraChargeService>;
String _$extraChargeNotifierHash() =>
    r'd789eb2b7ce9e115f42b4be663b8f44e43d55e8d';

/// See also [ExtraChargeNotifier].
@ProviderFor(ExtraChargeNotifier)
final extraChargeNotifierProvider = AutoDisposeAsyncNotifierProvider<
    ExtraChargeNotifier, List<ExtraCharge>>.internal(
  ExtraChargeNotifier.new,
  name: r'extraChargeNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$extraChargeNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ExtraChargeNotifier = AutoDisposeAsyncNotifier<List<ExtraCharge>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
