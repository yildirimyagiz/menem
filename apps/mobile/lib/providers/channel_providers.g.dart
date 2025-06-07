// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'channel_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$channelServiceHash() => r'e90ac36b9c8755edd3dfb66c72c3a782b4dac57a';

/// See also [channelService].
@ProviderFor(channelService)
final channelServiceProvider = AutoDisposeProvider<ChannelService>.internal(
  channelService,
  name: r'channelServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$channelServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ChannelServiceRef = AutoDisposeProviderRef<ChannelService>;
String _$channelNotifierHash() => r'7c4dd95c35ada00b699e8f33c7f30bc0333100f0';

/// See also [ChannelNotifier].
@ProviderFor(ChannelNotifier)
final channelNotifierProvider =
    AutoDisposeAsyncNotifierProvider<ChannelNotifier, List<Channel>>.internal(
  ChannelNotifier.new,
  name: r'channelNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$channelNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ChannelNotifier = AutoDisposeAsyncNotifier<List<Channel>>;
String _$channelDetailNotifierHash() =>
    r'b1e37526ce50fcb83abb11e3a9a653b84d0dfa55';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

abstract class _$ChannelDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Channel?> {
  late final String id;

  FutureOr<Channel?> build(
    String id,
  );
}

/// See also [ChannelDetailNotifier].
@ProviderFor(ChannelDetailNotifier)
const channelDetailNotifierProvider = ChannelDetailNotifierFamily();

/// See also [ChannelDetailNotifier].
class ChannelDetailNotifierFamily extends Family<AsyncValue<Channel?>> {
  /// See also [ChannelDetailNotifier].
  const ChannelDetailNotifierFamily();

  /// See also [ChannelDetailNotifier].
  ChannelDetailNotifierProvider call(
    String id,
  ) {
    return ChannelDetailNotifierProvider(
      id,
    );
  }

  @override
  ChannelDetailNotifierProvider getProviderOverride(
    covariant ChannelDetailNotifierProvider provider,
  ) {
    return call(
      provider.id,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'channelDetailNotifierProvider';
}

/// See also [ChannelDetailNotifier].
class ChannelDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<ChannelDetailNotifier,
        Channel?> {
  /// See also [ChannelDetailNotifier].
  ChannelDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => ChannelDetailNotifier()..id = id,
          from: channelDetailNotifierProvider,
          name: r'channelDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$channelDetailNotifierHash,
          dependencies: ChannelDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              ChannelDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  ChannelDetailNotifierProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.id,
  }) : super.internal();

  final String id;

  @override
  FutureOr<Channel?> runNotifierBuild(
    covariant ChannelDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(ChannelDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: ChannelDetailNotifierProvider._internal(
        () => create()..id = id,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        id: id,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<ChannelDetailNotifier, Channel?>
      createElement() {
    return _ChannelDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ChannelDetailNotifierProvider && other.id == id;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, id.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ChannelDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Channel?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _ChannelDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<ChannelDetailNotifier,
        Channel?> with ChannelDetailNotifierRef {
  _ChannelDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as ChannelDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
