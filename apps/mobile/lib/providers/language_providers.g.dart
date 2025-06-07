// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'language_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$languageServiceHash() => r'a14169f00471e5c7a57b5811726b356ffc38a9c8';

/// See also [languageService].
@ProviderFor(languageService)
final languageServiceProvider = AutoDisposeProvider<LanguageService>.internal(
  languageService,
  name: r'languageServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$languageServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef LanguageServiceRef = AutoDisposeProviderRef<LanguageService>;
String _$languageNotifierHash() => r'b42aa09bd0be02375c1932665ebc54487dd31250';

/// See also [LanguageNotifier].
@ProviderFor(LanguageNotifier)
final languageNotifierProvider =
    AutoDisposeAsyncNotifierProvider<LanguageNotifier, List<Language>>.internal(
  LanguageNotifier.new,
  name: r'languageNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$languageNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$LanguageNotifier = AutoDisposeAsyncNotifier<List<Language>>;
String _$languageDetailNotifierHash() =>
    r'247fa58b23aeb8a954c68c926964100a569cc0b8';

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

abstract class _$LanguageDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Language?> {
  late final String id;

  FutureOr<Language?> build(
    String id,
  );
}

/// See also [LanguageDetailNotifier].
@ProviderFor(LanguageDetailNotifier)
const languageDetailNotifierProvider = LanguageDetailNotifierFamily();

/// See also [LanguageDetailNotifier].
class LanguageDetailNotifierFamily extends Family<AsyncValue<Language?>> {
  /// See also [LanguageDetailNotifier].
  const LanguageDetailNotifierFamily();

  /// See also [LanguageDetailNotifier].
  LanguageDetailNotifierProvider call(
    String id,
  ) {
    return LanguageDetailNotifierProvider(
      id,
    );
  }

  @override
  LanguageDetailNotifierProvider getProviderOverride(
    covariant LanguageDetailNotifierProvider provider,
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
  String? get name => r'languageDetailNotifierProvider';
}

/// See also [LanguageDetailNotifier].
class LanguageDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<LanguageDetailNotifier,
        Language?> {
  /// See also [LanguageDetailNotifier].
  LanguageDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => LanguageDetailNotifier()..id = id,
          from: languageDetailNotifierProvider,
          name: r'languageDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$languageDetailNotifierHash,
          dependencies: LanguageDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              LanguageDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  LanguageDetailNotifierProvider._internal(
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
  FutureOr<Language?> runNotifierBuild(
    covariant LanguageDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(LanguageDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: LanguageDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<LanguageDetailNotifier, Language?>
      createElement() {
    return _LanguageDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is LanguageDetailNotifierProvider && other.id == id;
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
mixin LanguageDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Language?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _LanguageDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<LanguageDetailNotifier,
        Language?> with LanguageDetailNotifierRef {
  _LanguageDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as LanguageDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
