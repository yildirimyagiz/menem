// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facility_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$facilityServiceHash() => r'6f9696a24915420b39612a609ae1ab43802ff494';

/// See also [facilityService].
@ProviderFor(facilityService)
final facilityServiceProvider = AutoDisposeProvider<FacilityService>.internal(
  facilityService,
  name: r'facilityServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$facilityServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef FacilityServiceRef = AutoDisposeProviderRef<FacilityService>;
String _$facilityNotifierHash() => r'34e4f07c8a9d3607dd0e5002daac38500cd52604';

/// See also [FacilityNotifier].
@ProviderFor(FacilityNotifier)
final facilityNotifierProvider =
    AutoDisposeAsyncNotifierProvider<FacilityNotifier, List<Facility>>.internal(
  FacilityNotifier.new,
  name: r'facilityNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$facilityNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$FacilityNotifier = AutoDisposeAsyncNotifier<List<Facility>>;
String _$facilityDetailNotifierHash() =>
    r'd8342253f0b030e71ba24cb512084742a851d3ef';

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

abstract class _$FacilityDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Facility?> {
  late final String id;

  FutureOr<Facility?> build(
    String id,
  );
}

/// See also [FacilityDetailNotifier].
@ProviderFor(FacilityDetailNotifier)
const facilityDetailNotifierProvider = FacilityDetailNotifierFamily();

/// See also [FacilityDetailNotifier].
class FacilityDetailNotifierFamily extends Family<AsyncValue<Facility?>> {
  /// See also [FacilityDetailNotifier].
  const FacilityDetailNotifierFamily();

  /// See also [FacilityDetailNotifier].
  FacilityDetailNotifierProvider call(
    String id,
  ) {
    return FacilityDetailNotifierProvider(
      id,
    );
  }

  @override
  FacilityDetailNotifierProvider getProviderOverride(
    covariant FacilityDetailNotifierProvider provider,
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
  String? get name => r'facilityDetailNotifierProvider';
}

/// See also [FacilityDetailNotifier].
class FacilityDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<FacilityDetailNotifier,
        Facility?> {
  /// See also [FacilityDetailNotifier].
  FacilityDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => FacilityDetailNotifier()..id = id,
          from: facilityDetailNotifierProvider,
          name: r'facilityDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$facilityDetailNotifierHash,
          dependencies: FacilityDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              FacilityDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  FacilityDetailNotifierProvider._internal(
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
  FutureOr<Facility?> runNotifierBuild(
    covariant FacilityDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(FacilityDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: FacilityDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<FacilityDetailNotifier, Facility?>
      createElement() {
    return _FacilityDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is FacilityDetailNotifierProvider && other.id == id;
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
mixin FacilityDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Facility?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _FacilityDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<FacilityDetailNotifier,
        Facility?> with FacilityDetailNotifierRef {
  _FacilityDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as FacilityDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
