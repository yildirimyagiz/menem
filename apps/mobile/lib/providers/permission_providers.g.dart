// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'permission_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$permissionServiceHash() => r'fc0641db95a1dd076a25cac12d05282dc6cd9188';

/// Provider for the PermissionService
///
/// Copied from [permissionService].
@ProviderFor(permissionService)
final permissionServiceProvider =
    AutoDisposeProvider<PermissionService>.internal(
  permissionService,
  name: r'permissionServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$permissionServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef PermissionServiceRef = AutoDisposeProviderRef<PermissionService>;
String _$permissionNotifierHash() =>
    r'e4102840e37a9921de5c19b1988ca22a6230f7fe';

/// Notifier for managing a list of permissions
///
/// Copied from [PermissionNotifier].
@ProviderFor(PermissionNotifier)
final permissionNotifierProvider = AutoDisposeAsyncNotifierProvider<
    PermissionNotifier, List<Permission>>.internal(
  PermissionNotifier.new,
  name: r'permissionNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$permissionNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$PermissionNotifier = AutoDisposeAsyncNotifier<List<Permission>>;
String _$permissionDetailNotifierHash() =>
    r'e1fb154708cea95908bb09a3fdda095126382c41';

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

abstract class _$PermissionDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Permission?> {
  late final String id;

  FutureOr<Permission?> build(
    String id,
  );
}

/// Notifier for managing a single permission
///
/// Copied from [PermissionDetailNotifier].
@ProviderFor(PermissionDetailNotifier)
const permissionDetailNotifierProvider = PermissionDetailNotifierFamily();

/// Notifier for managing a single permission
///
/// Copied from [PermissionDetailNotifier].
class PermissionDetailNotifierFamily extends Family<AsyncValue<Permission?>> {
  /// Notifier for managing a single permission
  ///
  /// Copied from [PermissionDetailNotifier].
  const PermissionDetailNotifierFamily();

  /// Notifier for managing a single permission
  ///
  /// Copied from [PermissionDetailNotifier].
  PermissionDetailNotifierProvider call(
    String id,
  ) {
    return PermissionDetailNotifierProvider(
      id,
    );
  }

  @override
  PermissionDetailNotifierProvider getProviderOverride(
    covariant PermissionDetailNotifierProvider provider,
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
  String? get name => r'permissionDetailNotifierProvider';
}

/// Notifier for managing a single permission
///
/// Copied from [PermissionDetailNotifier].
class PermissionDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<PermissionDetailNotifier,
        Permission?> {
  /// Notifier for managing a single permission
  ///
  /// Copied from [PermissionDetailNotifier].
  PermissionDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => PermissionDetailNotifier()..id = id,
          from: permissionDetailNotifierProvider,
          name: r'permissionDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$permissionDetailNotifierHash,
          dependencies: PermissionDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              PermissionDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  PermissionDetailNotifierProvider._internal(
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
  FutureOr<Permission?> runNotifierBuild(
    covariant PermissionDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(PermissionDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: PermissionDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<PermissionDetailNotifier, Permission?>
      createElement() {
    return _PermissionDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is PermissionDetailNotifierProvider && other.id == id;
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
mixin PermissionDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Permission?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _PermissionDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<PermissionDetailNotifier,
        Permission?> with PermissionDetailNotifierRef {
  _PermissionDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as PermissionDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
