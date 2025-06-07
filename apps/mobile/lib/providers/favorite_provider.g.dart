// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'favorite_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$favoriteServiceHash() => r'eed97102cf4e5a9bd061fd828a6e64d996302b8c';

/// See also [favoriteService].
@ProviderFor(favoriteService)
final favoriteServiceProvider = AutoDisposeProvider<FavoriteService>.internal(
  favoriteService,
  name: r'favoriteServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$favoriteServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef FavoriteServiceRef = AutoDisposeProviderRef<FavoriteService>;
String _$favoriteNotifierHash() => r'60e8d84e2df38fb786d343d751c4c8c8a6ff25f7';

/// See also [FavoriteNotifier].
@ProviderFor(FavoriteNotifier)
final favoriteNotifierProvider =
    AutoDisposeAsyncNotifierProvider<FavoriteNotifier, List<Favorite>>.internal(
  FavoriteNotifier.new,
  name: r'favoriteNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$favoriteNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$FavoriteNotifier = AutoDisposeAsyncNotifier<List<Favorite>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
