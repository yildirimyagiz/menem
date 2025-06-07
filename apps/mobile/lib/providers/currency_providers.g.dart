// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'currency_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$currencyServiceHash() => r'd63d23837f3b8b9ec3741a7887685fc1eb56aeaa';

/// See also [currencyService].
@ProviderFor(currencyService)
final currencyServiceProvider = AutoDisposeProvider<CurrencyService>.internal(
  currencyService,
  name: r'currencyServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$currencyServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef CurrencyServiceRef = AutoDisposeProviderRef<CurrencyService>;
String _$currencyNotifierHash() => r'fc034eb73cfbd24d90d3a8631165bc0cfe49ff02';

/// See also [CurrencyNotifier].
@ProviderFor(CurrencyNotifier)
final currencyNotifierProvider =
    AutoDisposeAsyncNotifierProvider<CurrencyNotifier, List<Currency>>.internal(
  CurrencyNotifier.new,
  name: r'currencyNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$currencyNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$CurrencyNotifier = AutoDisposeAsyncNotifier<List<Currency>>;
String _$currencyDetailNotifierHash() =>
    r'9cbb0b16a29ae2d1eaaf11c1db82242f302003df';

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

abstract class _$CurrencyDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Currency?> {
  late final String id;

  FutureOr<Currency?> build(
    String id,
  );
}

/// See also [CurrencyDetailNotifier].
@ProviderFor(CurrencyDetailNotifier)
const currencyDetailNotifierProvider = CurrencyDetailNotifierFamily();

/// See also [CurrencyDetailNotifier].
class CurrencyDetailNotifierFamily extends Family<AsyncValue<Currency?>> {
  /// See also [CurrencyDetailNotifier].
  const CurrencyDetailNotifierFamily();

  /// See also [CurrencyDetailNotifier].
  CurrencyDetailNotifierProvider call(
    String id,
  ) {
    return CurrencyDetailNotifierProvider(
      id,
    );
  }

  @override
  CurrencyDetailNotifierProvider getProviderOverride(
    covariant CurrencyDetailNotifierProvider provider,
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
  String? get name => r'currencyDetailNotifierProvider';
}

/// See also [CurrencyDetailNotifier].
class CurrencyDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<CurrencyDetailNotifier,
        Currency?> {
  /// See also [CurrencyDetailNotifier].
  CurrencyDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => CurrencyDetailNotifier()..id = id,
          from: currencyDetailNotifierProvider,
          name: r'currencyDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$currencyDetailNotifierHash,
          dependencies: CurrencyDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              CurrencyDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  CurrencyDetailNotifierProvider._internal(
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
  FutureOr<Currency?> runNotifierBuild(
    covariant CurrencyDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(CurrencyDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: CurrencyDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<CurrencyDetailNotifier, Currency?>
      createElement() {
    return _CurrencyDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is CurrencyDetailNotifierProvider && other.id == id;
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
mixin CurrencyDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Currency?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _CurrencyDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<CurrencyDetailNotifier,
        Currency?> with CurrencyDetailNotifierRef {
  _CurrencyDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as CurrencyDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
