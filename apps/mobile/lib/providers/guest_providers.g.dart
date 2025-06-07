// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'guest_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$guestServiceHash() => r'3badd8efd079e07a05812e3fe12ca55c56bb7c77';

/// See also [guestService].
@ProviderFor(guestService)
final guestServiceProvider = AutoDisposeProvider<GuestService>.internal(
  guestService,
  name: r'guestServiceProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$guestServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef GuestServiceRef = AutoDisposeProviderRef<GuestService>;
String _$guestNotifierHash() => r'b373d4a092aa166bd77532590a38e1a8d9efba35';

/// See also [GuestNotifier].
@ProviderFor(GuestNotifier)
final guestNotifierProvider =
    AutoDisposeAsyncNotifierProvider<GuestNotifier, List<Guest>>.internal(
  GuestNotifier.new,
  name: r'guestNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$guestNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$GuestNotifier = AutoDisposeAsyncNotifier<List<Guest>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
