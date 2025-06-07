// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$propertyServiceHash() => r'edd20c034bbb52ae9cdcc3c96e57548dec274a33';

/// See also [propertyService].
@ProviderFor(propertyService)
final propertyServiceProvider = AutoDisposeProvider<PropertyService>.internal(
  propertyService,
  name: r'propertyServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$propertyServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef PropertyServiceRef = AutoDisposeProviderRef<PropertyService>;
String _$propertyNotifierHash() => r'765c3b43669e0fed260ed134aa662a60ce2dabae';

/// See also [PropertyNotifier].
@ProviderFor(PropertyNotifier)
final propertyNotifierProvider =
    AutoDisposeAsyncNotifierProvider<PropertyNotifier, List<Property>>.internal(
  PropertyNotifier.new,
  name: r'propertyNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$propertyNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$PropertyNotifier = AutoDisposeAsyncNotifier<List<Property>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
