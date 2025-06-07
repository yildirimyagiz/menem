// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$accountServiceHash() => r'cbce0b0429eb4271798aea9e630de81f8dc8a1b8';

/// See also [accountService].
@ProviderFor(accountService)
final accountServiceProvider = AutoDisposeProvider<AccountService>.internal(
  accountService,
  name: r'accountServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$accountServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef AccountServiceRef = AutoDisposeProviderRef<AccountService>;
String _$accountNotifierHash() => r'f7a31969e6e8b222a7f0e5a12f26d94e0e8aa1e7';

/// See also [AccountNotifier].
@ProviderFor(AccountNotifier)
final accountNotifierProvider =
    AutoDisposeAsyncNotifierProvider<AccountNotifier, List<Account>>.internal(
  AccountNotifier.new,
  name: r'accountNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$accountNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AccountNotifier = AutoDisposeAsyncNotifier<List<Account>>;
String _$accountDetailNotifierHash() =>
    r'b25ab41b41de04960aff52a0515db284718fc978';

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

abstract class _$AccountDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Account?> {
  late final String id;

  FutureOr<Account?> build(
    String id,
  );
}

/// See also [AccountDetailNotifier].
@ProviderFor(AccountDetailNotifier)
const accountDetailNotifierProvider = AccountDetailNotifierFamily();

/// See also [AccountDetailNotifier].
class AccountDetailNotifierFamily extends Family<AsyncValue<Account?>> {
  /// See also [AccountDetailNotifier].
  const AccountDetailNotifierFamily();

  /// See also [AccountDetailNotifier].
  AccountDetailNotifierProvider call(
    String id,
  ) {
    return AccountDetailNotifierProvider(
      id,
    );
  }

  @override
  AccountDetailNotifierProvider getProviderOverride(
    covariant AccountDetailNotifierProvider provider,
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
  String? get name => r'accountDetailNotifierProvider';
}

/// See also [AccountDetailNotifier].
class AccountDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<AccountDetailNotifier,
        Account?> {
  /// See also [AccountDetailNotifier].
  AccountDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => AccountDetailNotifier()..id = id,
          from: accountDetailNotifierProvider,
          name: r'accountDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$accountDetailNotifierHash,
          dependencies: AccountDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              AccountDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  AccountDetailNotifierProvider._internal(
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
  FutureOr<Account?> runNotifierBuild(
    covariant AccountDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(AccountDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: AccountDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<AccountDetailNotifier, Account?>
      createElement() {
    return _AccountDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is AccountDetailNotifierProvider && other.id == id;
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
mixin AccountDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Account?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _AccountDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<AccountDetailNotifier,
        Account?> with AccountDetailNotifierRef {
  _AccountDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as AccountDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
