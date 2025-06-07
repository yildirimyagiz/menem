// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mortgage_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$mortgageServiceProviderHash() =>
    r'73bc940a92365117785ef6e07afe58602a9bc854';

/// See also [MortgageServiceProvider].
@ProviderFor(MortgageServiceProvider)
final mortgageServiceProviderProvider = AutoDisposeNotifierProvider<
    MortgageServiceProvider, MortgageService>.internal(
  MortgageServiceProvider.new,
  name: r'mortgageServiceProviderProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$mortgageServiceProviderHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$MortgageServiceProvider = AutoDisposeNotifier<MortgageService>;
String _$mortgageListNotifierHash() =>
    r'62c37f2868fad4467e752887d07e36c2525dd2e1';

/// See also [MortgageListNotifier].
@ProviderFor(MortgageListNotifier)
final mortgageListNotifierProvider = AutoDisposeAsyncNotifierProvider<
    MortgageListNotifier, List<Mortgage>>.internal(
  MortgageListNotifier.new,
  name: r'mortgageListNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$mortgageListNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$MortgageListNotifier = AutoDisposeAsyncNotifier<List<Mortgage>>;
String _$mortgageDetailNotifierHash() =>
    r'7113e91383b179fc859099506eab866e06f3fb55';

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

abstract class _$MortgageDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Mortgage?> {
  late final String id;

  FutureOr<Mortgage?> build(
    String id,
  );
}

/// See also [MortgageDetailNotifier].
@ProviderFor(MortgageDetailNotifier)
const mortgageDetailNotifierProvider = MortgageDetailNotifierFamily();

/// See also [MortgageDetailNotifier].
class MortgageDetailNotifierFamily extends Family<AsyncValue<Mortgage?>> {
  /// See also [MortgageDetailNotifier].
  const MortgageDetailNotifierFamily();

  /// See also [MortgageDetailNotifier].
  MortgageDetailNotifierProvider call(
    String id,
  ) {
    return MortgageDetailNotifierProvider(
      id,
    );
  }

  @override
  MortgageDetailNotifierProvider getProviderOverride(
    covariant MortgageDetailNotifierProvider provider,
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
  String? get name => r'mortgageDetailNotifierProvider';
}

/// See also [MortgageDetailNotifier].
class MortgageDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<MortgageDetailNotifier,
        Mortgage?> {
  /// See also [MortgageDetailNotifier].
  MortgageDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => MortgageDetailNotifier()..id = id,
          from: mortgageDetailNotifierProvider,
          name: r'mortgageDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$mortgageDetailNotifierHash,
          dependencies: MortgageDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              MortgageDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  MortgageDetailNotifierProvider._internal(
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
  FutureOr<Mortgage?> runNotifierBuild(
    covariant MortgageDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(MortgageDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: MortgageDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<MortgageDetailNotifier, Mortgage?>
      createElement() {
    return _MortgageDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is MortgageDetailNotifierProvider && other.id == id;
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
mixin MortgageDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Mortgage?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _MortgageDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<MortgageDetailNotifier,
        Mortgage?> with MortgageDetailNotifierRef {
  _MortgageDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as MortgageDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
