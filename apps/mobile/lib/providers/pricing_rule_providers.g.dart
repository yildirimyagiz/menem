// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pricing_rule_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$pricingRuleServiceHash() =>
    r'3d6ca77ef004e447d4c353f3bf59e43b70a5104b';

/// See also [pricingRuleService].
@ProviderFor(pricingRuleService)
final pricingRuleServiceProvider =
    AutoDisposeProvider<PricingRuleService>.internal(
  pricingRuleService,
  name: r'pricingRuleServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$pricingRuleServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef PricingRuleServiceRef = AutoDisposeProviderRef<PricingRuleService>;
String _$pricingRuleNotifierHash() =>
    r'7c11875db4e4e7a557a52d59fecd17121b50bd85';

/// See also [PricingRuleNotifier].
@ProviderFor(PricingRuleNotifier)
final pricingRuleNotifierProvider = AutoDisposeAsyncNotifierProvider<
    PricingRuleNotifier, List<PricingRule>>.internal(
  PricingRuleNotifier.new,
  name: r'pricingRuleNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$pricingRuleNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$PricingRuleNotifier = AutoDisposeAsyncNotifier<List<PricingRule>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
