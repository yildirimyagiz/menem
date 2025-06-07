// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'discount_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$discountServiceHash() => r'a2d4de7831deaf79d38afd0006f0fc0c8c6242ff';

/// See also [discountService].
@ProviderFor(discountService)
final discountServiceProvider = AutoDisposeProvider<DiscountService>.internal(
  discountService,
  name: r'discountServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$discountServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef DiscountServiceRef = AutoDisposeProviderRef<DiscountService>;
String _$discountNotifierHash() => r'3fae30c04bc5ed61b474ca2a1f1935c532da7082';

/// See also [DiscountNotifier].
@ProviderFor(DiscountNotifier)
final discountNotifierProvider =
    AutoDisposeAsyncNotifierProvider<DiscountNotifier, List<Discount>>.internal(
  DiscountNotifier.new,
  name: r'discountNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$discountNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$DiscountNotifier = AutoDisposeAsyncNotifier<List<Discount>>;
String _$discountDetailNotifierHash() =>
    r'a58ee510f1b8c9d36f93e0633ab3e45742f51547';

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

abstract class _$DiscountDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Discount?> {
  late final String id;

  FutureOr<Discount?> build(
    String id,
  );
}

/// See also [DiscountDetailNotifier].
@ProviderFor(DiscountDetailNotifier)
const discountDetailNotifierProvider = DiscountDetailNotifierFamily();

/// See also [DiscountDetailNotifier].
class DiscountDetailNotifierFamily extends Family<AsyncValue<Discount?>> {
  /// See also [DiscountDetailNotifier].
  const DiscountDetailNotifierFamily();

  /// See also [DiscountDetailNotifier].
  DiscountDetailNotifierProvider call(
    String id,
  ) {
    return DiscountDetailNotifierProvider(
      id,
    );
  }

  @override
  DiscountDetailNotifierProvider getProviderOverride(
    covariant DiscountDetailNotifierProvider provider,
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
  String? get name => r'discountDetailNotifierProvider';
}

/// See also [DiscountDetailNotifier].
class DiscountDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<DiscountDetailNotifier,
        Discount?> {
  /// See also [DiscountDetailNotifier].
  DiscountDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => DiscountDetailNotifier()..id = id,
          from: discountDetailNotifierProvider,
          name: r'discountDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$discountDetailNotifierHash,
          dependencies: DiscountDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              DiscountDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  DiscountDetailNotifierProvider._internal(
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
  FutureOr<Discount?> runNotifierBuild(
    covariant DiscountDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(DiscountDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: DiscountDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<DiscountDetailNotifier, Discount?>
      createElement() {
    return _DiscountDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is DiscountDetailNotifierProvider && other.id == id;
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
mixin DiscountDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Discount?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _DiscountDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<DiscountDetailNotifier,
        Discount?> with DiscountDetailNotifierRef {
  _DiscountDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as DiscountDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
