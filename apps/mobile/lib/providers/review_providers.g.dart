// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$reviewServiceHash() => r'a70f72851b420d9b1247f5e17907880898fd884b';

/// See also [reviewService].
@ProviderFor(reviewService)
final reviewServiceProvider = AutoDisposeProvider<ReviewService>.internal(
  reviewService,
  name: r'reviewServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reviewServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ReviewServiceRef = AutoDisposeProviderRef<ReviewService>;
String _$reviewNotifierHash() => r'7136b631106f83307d129567d69e931da2c3bf91';

/// See also [ReviewNotifier].
@ProviderFor(ReviewNotifier)
final reviewNotifierProvider =
    AutoDisposeAsyncNotifierProvider<ReviewNotifier, List<Review>>.internal(
  ReviewNotifier.new,
  name: r'reviewNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reviewNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ReviewNotifier = AutoDisposeAsyncNotifier<List<Review>>;
String _$reviewDetailNotifierHash() =>
    r'f195a807e948ff6ee74542e52fe6ad685563a64f';

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

abstract class _$ReviewDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Review?> {
  late final String id;

  FutureOr<Review?> build(
    String id,
  );
}

/// See also [ReviewDetailNotifier].
@ProviderFor(ReviewDetailNotifier)
const reviewDetailNotifierProvider = ReviewDetailNotifierFamily();

/// See also [ReviewDetailNotifier].
class ReviewDetailNotifierFamily extends Family<AsyncValue<Review?>> {
  /// See also [ReviewDetailNotifier].
  const ReviewDetailNotifierFamily();

  /// See also [ReviewDetailNotifier].
  ReviewDetailNotifierProvider call(
    String id,
  ) {
    return ReviewDetailNotifierProvider(
      id,
    );
  }

  @override
  ReviewDetailNotifierProvider getProviderOverride(
    covariant ReviewDetailNotifierProvider provider,
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
  String? get name => r'reviewDetailNotifierProvider';
}

/// See also [ReviewDetailNotifier].
class ReviewDetailNotifierProvider extends AutoDisposeAsyncNotifierProviderImpl<
    ReviewDetailNotifier, Review?> {
  /// See also [ReviewDetailNotifier].
  ReviewDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => ReviewDetailNotifier()..id = id,
          from: reviewDetailNotifierProvider,
          name: r'reviewDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$reviewDetailNotifierHash,
          dependencies: ReviewDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              ReviewDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  ReviewDetailNotifierProvider._internal(
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
  FutureOr<Review?> runNotifierBuild(
    covariant ReviewDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(ReviewDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: ReviewDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<ReviewDetailNotifier, Review?>
      createElement() {
    return _ReviewDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ReviewDetailNotifierProvider && other.id == id;
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
mixin ReviewDetailNotifierRef on AutoDisposeAsyncNotifierProviderRef<Review?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _ReviewDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<ReviewDetailNotifier,
        Review?> with ReviewDetailNotifierRef {
  _ReviewDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as ReviewDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
