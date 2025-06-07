// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'availability_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$availabilityServiceHash() =>
    r'433e055174f92f6b1097a52cfe14a5e88641e24b';

/// See also [availabilityService].
@ProviderFor(availabilityService)
final availabilityServiceProvider =
    AutoDisposeProvider<AvailabilityService>.internal(
  availabilityService,
  name: r'availabilityServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$availabilityServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef AvailabilityServiceRef = AutoDisposeProviderRef<AvailabilityService>;
String _$availabilityNotifierHash() =>
    r'510a530a7e0e803425ed41547e8453dc7bfb30df';

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

abstract class _$AvailabilityNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Availability?> {
  late final String? id;

  FutureOr<Availability?> build(
    String? id,
  );
}

/// See also [AvailabilityNotifier].
@ProviderFor(AvailabilityNotifier)
const availabilityNotifierProvider = AvailabilityNotifierFamily();

/// See also [AvailabilityNotifier].
class AvailabilityNotifierFamily extends Family<AsyncValue<Availability?>> {
  /// See also [AvailabilityNotifier].
  const AvailabilityNotifierFamily();

  /// See also [AvailabilityNotifier].
  AvailabilityNotifierProvider call(
    String? id,
  ) {
    return AvailabilityNotifierProvider(
      id,
    );
  }

  @override
  AvailabilityNotifierProvider getProviderOverride(
    covariant AvailabilityNotifierProvider provider,
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
  String? get name => r'availabilityNotifierProvider';
}

/// See also [AvailabilityNotifier].
class AvailabilityNotifierProvider extends AutoDisposeAsyncNotifierProviderImpl<
    AvailabilityNotifier, Availability?> {
  /// See also [AvailabilityNotifier].
  AvailabilityNotifierProvider(
    String? id,
  ) : this._internal(
          () => AvailabilityNotifier()..id = id,
          from: availabilityNotifierProvider,
          name: r'availabilityNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$availabilityNotifierHash,
          dependencies: AvailabilityNotifierFamily._dependencies,
          allTransitiveDependencies:
              AvailabilityNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  AvailabilityNotifierProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.id,
  }) : super.internal();

  final String? id;

  @override
  FutureOr<Availability?> runNotifierBuild(
    covariant AvailabilityNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(AvailabilityNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: AvailabilityNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<AvailabilityNotifier, Availability?>
      createElement() {
    return _AvailabilityNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is AvailabilityNotifierProvider && other.id == id;
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
mixin AvailabilityNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Availability?> {
  /// The parameter `id` of this provider.
  String? get id;
}

class _AvailabilityNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<AvailabilityNotifier,
        Availability?> with AvailabilityNotifierRef {
  _AvailabilityNotifierProviderElement(super.provider);

  @override
  String? get id => (origin as AvailabilityNotifierProvider).id;
}

String _$availabilityListNotifierHash() =>
    r'a891a535fe24c843a0c405fd0e294d153f4262cd';

/// See also [AvailabilityListNotifier].
@ProviderFor(AvailabilityListNotifier)
final availabilityListNotifierProvider = AsyncNotifierProvider<
    AvailabilityListNotifier, List<Availability>>.internal(
  AvailabilityListNotifier.new,
  name: r'availabilityListNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$availabilityListNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AvailabilityListNotifier = AsyncNotifier<List<Availability>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
