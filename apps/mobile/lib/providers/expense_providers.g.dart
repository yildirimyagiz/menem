// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expense_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$expenseServiceHash() => r'9266390e45ccb6ff0ce53ad8332b579c05676a13';

/// See also [expenseService].
@ProviderFor(expenseService)
final expenseServiceProvider = Provider<ExpenseService>.internal(
  expenseService,
  name: r'expenseServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$expenseServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ExpenseServiceRef = ProviderRef<ExpenseService>;
String _$expenseNotifierHash() => r'14c7fe038461a64936b3bc8a1088bf9e73e7d752';

/// See also [ExpenseNotifier].
@ProviderFor(ExpenseNotifier)
final expenseNotifierProvider =
    AutoDisposeAsyncNotifierProvider<ExpenseNotifier, List<Expense>>.internal(
  ExpenseNotifier.new,
  name: r'expenseNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$expenseNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ExpenseNotifier = AutoDisposeAsyncNotifier<List<Expense>>;
String _$expenseDetailNotifierHash() =>
    r'65385cc3dc21d8f0f155408157daf05baaa1c903';

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

abstract class _$ExpenseDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Expense> {
  late final String id;

  FutureOr<Expense> build(
    String id,
  );
}

/// See also [ExpenseDetailNotifier].
@ProviderFor(ExpenseDetailNotifier)
const expenseDetailNotifierProvider = ExpenseDetailNotifierFamily();

/// See also [ExpenseDetailNotifier].
class ExpenseDetailNotifierFamily extends Family<AsyncValue<Expense>> {
  /// See also [ExpenseDetailNotifier].
  const ExpenseDetailNotifierFamily();

  /// See also [ExpenseDetailNotifier].
  ExpenseDetailNotifierProvider call(
    String id,
  ) {
    return ExpenseDetailNotifierProvider(
      id,
    );
  }

  @override
  ExpenseDetailNotifierProvider getProviderOverride(
    covariant ExpenseDetailNotifierProvider provider,
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
  String? get name => r'expenseDetailNotifierProvider';
}

/// See also [ExpenseDetailNotifier].
class ExpenseDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<ExpenseDetailNotifier,
        Expense> {
  /// See also [ExpenseDetailNotifier].
  ExpenseDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => ExpenseDetailNotifier()..id = id,
          from: expenseDetailNotifierProvider,
          name: r'expenseDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$expenseDetailNotifierHash,
          dependencies: ExpenseDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              ExpenseDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  ExpenseDetailNotifierProvider._internal(
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
  FutureOr<Expense> runNotifierBuild(
    covariant ExpenseDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(ExpenseDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: ExpenseDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<ExpenseDetailNotifier, Expense>
      createElement() {
    return _ExpenseDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ExpenseDetailNotifierProvider && other.id == id;
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
mixin ExpenseDetailNotifierRef on AutoDisposeAsyncNotifierProviderRef<Expense> {
  /// The parameter `id` of this provider.
  String get id;
}

class _ExpenseDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<ExpenseDetailNotifier,
        Expense> with ExpenseDetailNotifierRef {
  _ExpenseDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as ExpenseDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
