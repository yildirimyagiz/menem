// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'commission_rule_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$commissionRuleServiceHash() =>
    r'7818e2e734a8ac3311c194eeca5393cab65ba078';

/// See also [commissionRuleService].
@ProviderFor(commissionRuleService)
final commissionRuleServiceProvider =
    AutoDisposeProvider<CommissionRuleService>.internal(
  commissionRuleService,
  name: r'commissionRuleServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$commissionRuleServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef CommissionRuleServiceRef
    = AutoDisposeProviderRef<CommissionRuleService>;
String _$commissionRuleNotifierHash() =>
    r'e4008c325ff01879fa34c133a6b5429adbd19ee7';

/// See also [CommissionRuleNotifier].
@ProviderFor(CommissionRuleNotifier)
final commissionRuleNotifierProvider = AutoDisposeAsyncNotifierProvider<
    CommissionRuleNotifier, List<CommissionRule>>.internal(
  CommissionRuleNotifier.new,
  name: r'commissionRuleNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$commissionRuleNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$CommissionRuleNotifier
    = AutoDisposeAsyncNotifier<List<CommissionRule>>;
String _$commissionRuleDetailNotifierHash() =>
    r'e99265a5d11bfdf6f39d84ff8d969524cfc06539';

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

abstract class _$CommissionRuleDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<CommissionRule?> {
  late final String id;

  FutureOr<CommissionRule?> build(
    String id,
  );
}

/// See also [CommissionRuleDetailNotifier].
@ProviderFor(CommissionRuleDetailNotifier)
const commissionRuleDetailNotifierProvider =
    CommissionRuleDetailNotifierFamily();

/// See also [CommissionRuleDetailNotifier].
class CommissionRuleDetailNotifierFamily
    extends Family<AsyncValue<CommissionRule?>> {
  /// See also [CommissionRuleDetailNotifier].
  const CommissionRuleDetailNotifierFamily();

  /// See also [CommissionRuleDetailNotifier].
  CommissionRuleDetailNotifierProvider call(
    String id,
  ) {
    return CommissionRuleDetailNotifierProvider(
      id,
    );
  }

  @override
  CommissionRuleDetailNotifierProvider getProviderOverride(
    covariant CommissionRuleDetailNotifierProvider provider,
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
  String? get name => r'commissionRuleDetailNotifierProvider';
}

/// See also [CommissionRuleDetailNotifier].
class CommissionRuleDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<CommissionRuleDetailNotifier,
        CommissionRule?> {
  /// See also [CommissionRuleDetailNotifier].
  CommissionRuleDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => CommissionRuleDetailNotifier()..id = id,
          from: commissionRuleDetailNotifierProvider,
          name: r'commissionRuleDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$commissionRuleDetailNotifierHash,
          dependencies: CommissionRuleDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              CommissionRuleDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  CommissionRuleDetailNotifierProvider._internal(
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
  FutureOr<CommissionRule?> runNotifierBuild(
    covariant CommissionRuleDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(CommissionRuleDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: CommissionRuleDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<CommissionRuleDetailNotifier,
      CommissionRule?> createElement() {
    return _CommissionRuleDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is CommissionRuleDetailNotifierProvider && other.id == id;
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
mixin CommissionRuleDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<CommissionRule?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _CommissionRuleDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<
        CommissionRuleDetailNotifier,
        CommissionRule?> with CommissionRuleDetailNotifierRef {
  _CommissionRuleDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as CommissionRuleDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
