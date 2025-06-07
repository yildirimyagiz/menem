// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mention_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$mentionServiceHash() => r'2f15722bd3099282cd932e80313779843658a889';

/// See also [mentionService].
@ProviderFor(mentionService)
final mentionServiceProvider = AutoDisposeProvider<MentionService>.internal(
  mentionService,
  name: r'mentionServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$mentionServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef MentionServiceRef = AutoDisposeProviderRef<MentionService>;
String _$mentionNotifierHash() => r'd4143c665764eeca635918381b451876e2bf9ef7';

/// See also [MentionNotifier].
@ProviderFor(MentionNotifier)
final mentionNotifierProvider =
    AutoDisposeAsyncNotifierProvider<MentionNotifier, List<Mention>>.internal(
  MentionNotifier.new,
  name: r'mentionNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$mentionNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$MentionNotifier = AutoDisposeAsyncNotifier<List<Mention>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
