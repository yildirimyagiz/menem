// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'provider_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$providerServiceHash() => r'a40eb7ebb3bb99cf14bf83ac46a3e4a61d99b05e';

/// See also [providerService].
@ProviderFor(providerService)
final providerServiceProvider = AutoDisposeProvider<ProviderService>.internal(
  providerService,
  name: r'providerServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$providerServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ProviderServiceRef = AutoDisposeProviderRef<ProviderService>;
String _$providerNotifierHash() => r'13101a22928713555add348d8536198a59597c13';

/// See also [ProviderNotifier].
@ProviderFor(ProviderNotifier)
final providerNotifierProvider =
    AutoDisposeAsyncNotifierProvider<ProviderNotifier, List<Provider>>.internal(
  ProviderNotifier.new,
  name: r'providerNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$providerNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ProviderNotifier = AutoDisposeAsyncNotifier<List<Provider>>;
String _$providerDetailNotifierHash() =>
    r'4d6c9e3df55049cc1b4ff2f070780e340513b018';

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

abstract class _$ProviderDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Provider?> {
  late final String id;

  FutureOr<Provider?> build(
    String id,
  );
}

/// See also [ProviderDetailNotifier].
@ProviderFor(ProviderDetailNotifier)
const providerDetailNotifierProvider = ProviderDetailNotifierFamily();

/// See also [ProviderDetailNotifier].
class ProviderDetailNotifierFamily extends Family<AsyncValue<Provider?>> {
  /// See also [ProviderDetailNotifier].
  const ProviderDetailNotifierFamily();

  /// See also [ProviderDetailNotifier].
  ProviderDetailNotifierProvider call(
    String id,
  ) {
    return ProviderDetailNotifierProvider(
      id,
    );
  }

  @override
  ProviderDetailNotifierProvider getProviderOverride(
    covariant ProviderDetailNotifierProvider provider,
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
  String? get name => r'providerDetailNotifierProvider';
}

/// See also [ProviderDetailNotifier].
class ProviderDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<ProviderDetailNotifier,
        Provider?> {
  /// See also [ProviderDetailNotifier].
  ProviderDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => ProviderDetailNotifier()..id = id,
          from: providerDetailNotifierProvider,
          name: r'providerDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$providerDetailNotifierHash,
          dependencies: ProviderDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              ProviderDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  ProviderDetailNotifierProvider._internal(
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
  FutureOr<Provider?> runNotifierBuild(
    covariant ProviderDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(ProviderDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: ProviderDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<ProviderDetailNotifier, Provider?>
      createElement() {
    return _ProviderDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ProviderDetailNotifierProvider && other.id == id;
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
mixin ProviderDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Provider?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _ProviderDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<ProviderDetailNotifier,
        Provider?> with ProviderDetailNotifierRef {
  _ProviderDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as ProviderDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
