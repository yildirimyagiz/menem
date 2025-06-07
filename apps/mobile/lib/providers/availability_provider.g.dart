// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'availability_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$availabilityServiceHash() =>
    r'50cd05bf0647ef37de05b37c56d171d58da2349f';

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
    r'38d96a58fb7dff092cdf7eb809bdfbaabcf8ab4e';

/// See also [AvailabilityNotifier].
@ProviderFor(AvailabilityNotifier)
final availabilityNotifierProvider = AutoDisposeAsyncNotifierProvider<
    AvailabilityNotifier, List<Availability>>.internal(
  AvailabilityNotifier.new,
  name: r'availabilityNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$availabilityNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AvailabilityNotifier = AutoDisposeAsyncNotifier<List<Availability>>;
String _$availabilityDetailNotifierHash() =>
    r'ef28ecf793a296076ce2abf829d17406bd4a1189';

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

abstract class _$AvailabilityDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Availability?> {
  late final String id;

  FutureOr<Availability?> build(
    String id,
  );
}

/// See also [AvailabilityDetailNotifier].
@ProviderFor(AvailabilityDetailNotifier)
const availabilityDetailNotifierProvider = AvailabilityDetailNotifierFamily();

/// See also [AvailabilityDetailNotifier].
class AvailabilityDetailNotifierFamily
    extends Family<AsyncValue<Availability?>> {
  /// See also [AvailabilityDetailNotifier].
  const AvailabilityDetailNotifierFamily();

  /// See also [AvailabilityDetailNotifier].
  AvailabilityDetailNotifierProvider call(
    String id,
  ) {
    return AvailabilityDetailNotifierProvider(
      id,
    );
  }

  @override
  AvailabilityDetailNotifierProvider getProviderOverride(
    covariant AvailabilityDetailNotifierProvider provider,
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
  String? get name => r'availabilityDetailNotifierProvider';
}

/// See also [AvailabilityDetailNotifier].
class AvailabilityDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<AvailabilityDetailNotifier,
        Availability?> {
  /// See also [AvailabilityDetailNotifier].
  AvailabilityDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => AvailabilityDetailNotifier()..id = id,
          from: availabilityDetailNotifierProvider,
          name: r'availabilityDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$availabilityDetailNotifierHash,
          dependencies: AvailabilityDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              AvailabilityDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  AvailabilityDetailNotifierProvider._internal(
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
  FutureOr<Availability?> runNotifierBuild(
    covariant AvailabilityDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(AvailabilityDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: AvailabilityDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<AvailabilityDetailNotifier,
      Availability?> createElement() {
    return _AvailabilityDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is AvailabilityDetailNotifierProvider && other.id == id;
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
mixin AvailabilityDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Availability?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _AvailabilityDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<AvailabilityDetailNotifier,
        Availability?> with AvailabilityDetailNotifierRef {
  _AvailabilityDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as AvailabilityDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
