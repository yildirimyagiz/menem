// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'photo_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$photoServiceHash() => r'ae9cc823067ce4d8d0a6fd3de78ebaf1244e1bbf';

/// See also [photoService].
@ProviderFor(photoService)
final photoServiceProvider = AutoDisposeProvider<PhotoService>.internal(
  photoService,
  name: r'photoServiceProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$photoServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef PhotoServiceRef = AutoDisposeProviderRef<PhotoService>;
String _$photoNotifierHash() => r'0dbd83a348a8dad1b0bed4c39d8121010c5dd0c3';

/// See also [PhotoNotifier].
@ProviderFor(PhotoNotifier)
final photoNotifierProvider =
    AutoDisposeAsyncNotifierProvider<PhotoNotifier, List<dynamic>>.internal(
  PhotoNotifier.new,
  name: r'photoNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$photoNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$PhotoNotifier = AutoDisposeAsyncNotifier<List<dynamic>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
