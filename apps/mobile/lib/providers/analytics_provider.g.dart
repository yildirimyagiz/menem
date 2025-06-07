// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$analyticsServiceHash() => r'950206a3008e31fce27fb5837209f992664c7aea';

/// See also [analyticsService].
@ProviderFor(analyticsService)
final analyticsServiceProvider = AutoDisposeProvider<AnalyticsService>.internal(
  analyticsService,
  name: r'analyticsServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$analyticsServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef AnalyticsServiceRef = AutoDisposeProviderRef<AnalyticsService>;
String _$analyticsNotifierHash() => r'a7196afb5d807a8aea4eca65769bbab5eab89eab';

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

abstract class _$AnalyticsNotifier
    extends BuildlessAutoDisposeAsyncNotifier<List<Analytics>> {
  late final String id;

  FutureOr<List<Analytics>> build(
    String id,
  );
}

/// See also [AnalyticsNotifier].
@ProviderFor(AnalyticsNotifier)
const analyticsNotifierProvider = AnalyticsNotifierFamily();

/// See also [AnalyticsNotifier].
class AnalyticsNotifierFamily extends Family<AsyncValue<List<Analytics>>> {
  /// See also [AnalyticsNotifier].
  const AnalyticsNotifierFamily();

  /// See also [AnalyticsNotifier].
  AnalyticsNotifierProvider call(
    String id,
  ) {
    return AnalyticsNotifierProvider(
      id,
    );
  }

  @override
  AnalyticsNotifierProvider getProviderOverride(
    covariant AnalyticsNotifierProvider provider,
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
  String? get name => r'analyticsNotifierProvider';
}

/// See also [AnalyticsNotifier].
class AnalyticsNotifierProvider extends AutoDisposeAsyncNotifierProviderImpl<
    AnalyticsNotifier, List<Analytics>> {
  /// See also [AnalyticsNotifier].
  AnalyticsNotifierProvider(
    String id,
  ) : this._internal(
          () => AnalyticsNotifier()..id = id,
          from: analyticsNotifierProvider,
          name: r'analyticsNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$analyticsNotifierHash,
          dependencies: AnalyticsNotifierFamily._dependencies,
          allTransitiveDependencies:
              AnalyticsNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  AnalyticsNotifierProvider._internal(
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
  FutureOr<List<Analytics>> runNotifierBuild(
    covariant AnalyticsNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(AnalyticsNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: AnalyticsNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<AnalyticsNotifier, List<Analytics>>
      createElement() {
    return _AnalyticsNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is AnalyticsNotifierProvider && other.id == id;
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
mixin AnalyticsNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<List<Analytics>> {
  /// The parameter `id` of this provider.
  String get id;
}

class _AnalyticsNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<AnalyticsNotifier,
        List<Analytics>> with AnalyticsNotifierRef {
  _AnalyticsNotifierProviderElement(super.provider);

  @override
  String get id => (origin as AnalyticsNotifierProvider).id;
}

String _$analyticsDetailNotifierHash() =>
    r'eef98b0c9aab0fe7e5973c39a9222e406af0a61c';

abstract class _$AnalyticsDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Analytics?> {
  late final String id;

  FutureOr<Analytics?> build(
    String id,
  );
}

/// See also [AnalyticsDetailNotifier].
@ProviderFor(AnalyticsDetailNotifier)
const analyticsDetailNotifierProvider = AnalyticsDetailNotifierFamily();

/// See also [AnalyticsDetailNotifier].
class AnalyticsDetailNotifierFamily extends Family<AsyncValue<Analytics?>> {
  /// See also [AnalyticsDetailNotifier].
  const AnalyticsDetailNotifierFamily();

  /// See also [AnalyticsDetailNotifier].
  AnalyticsDetailNotifierProvider call(
    String id,
  ) {
    return AnalyticsDetailNotifierProvider(
      id,
    );
  }

  @override
  AnalyticsDetailNotifierProvider getProviderOverride(
    covariant AnalyticsDetailNotifierProvider provider,
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
  String? get name => r'analyticsDetailNotifierProvider';
}

/// See also [AnalyticsDetailNotifier].
class AnalyticsDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<AnalyticsDetailNotifier,
        Analytics?> {
  /// See also [AnalyticsDetailNotifier].
  AnalyticsDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => AnalyticsDetailNotifier()..id = id,
          from: analyticsDetailNotifierProvider,
          name: r'analyticsDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$analyticsDetailNotifierHash,
          dependencies: AnalyticsDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              AnalyticsDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  AnalyticsDetailNotifierProvider._internal(
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
  FutureOr<Analytics?> runNotifierBuild(
    covariant AnalyticsDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(AnalyticsDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: AnalyticsDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<AnalyticsDetailNotifier, Analytics?>
      createElement() {
    return _AnalyticsDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is AnalyticsDetailNotifierProvider && other.id == id;
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
mixin AnalyticsDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Analytics?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _AnalyticsDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<AnalyticsDetailNotifier,
        Analytics?> with AnalyticsDetailNotifierRef {
  _AnalyticsDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as AnalyticsDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
