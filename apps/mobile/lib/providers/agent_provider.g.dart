// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'agent_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$agentServiceHash() => r'28952aa24a0569fda8a13fb28a57cfe220c05c72';

/// See also [agentService].
@ProviderFor(agentService)
final agentServiceProvider = AutoDisposeProvider<AgentService>.internal(
  agentService,
  name: r'agentServiceProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$agentServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef AgentServiceRef = AutoDisposeProviderRef<AgentService>;
String _$agentNotifierHash() => r'42cb06bab94daa89ca74c1dd62cfa5775d14a874';

/// See also [AgentNotifier].
@ProviderFor(AgentNotifier)
final agentNotifierProvider =
    AutoDisposeAsyncNotifierProvider<AgentNotifier, List<Agent>>.internal(
  AgentNotifier.new,
  name: r'agentNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$agentNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AgentNotifier = AutoDisposeAsyncNotifier<List<Agent>>;
String _$agentDetailNotifierHash() =>
    r'0272fdf2e733aa103226dab36e796c89c2f1f660';

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

abstract class _$AgentDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Agent?> {
  late final String id;

  FutureOr<Agent?> build(
    String id,
  );
}

/// See also [AgentDetailNotifier].
@ProviderFor(AgentDetailNotifier)
const agentDetailNotifierProvider = AgentDetailNotifierFamily();

/// See also [AgentDetailNotifier].
class AgentDetailNotifierFamily extends Family<AsyncValue<Agent?>> {
  /// See also [AgentDetailNotifier].
  const AgentDetailNotifierFamily();

  /// See also [AgentDetailNotifier].
  AgentDetailNotifierProvider call(
    String id,
  ) {
    return AgentDetailNotifierProvider(
      id,
    );
  }

  @override
  AgentDetailNotifierProvider getProviderOverride(
    covariant AgentDetailNotifierProvider provider,
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
  String? get name => r'agentDetailNotifierProvider';
}

/// See also [AgentDetailNotifier].
class AgentDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<AgentDetailNotifier, Agent?> {
  /// See also [AgentDetailNotifier].
  AgentDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => AgentDetailNotifier()..id = id,
          from: agentDetailNotifierProvider,
          name: r'agentDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$agentDetailNotifierHash,
          dependencies: AgentDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              AgentDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  AgentDetailNotifierProvider._internal(
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
  FutureOr<Agent?> runNotifierBuild(
    covariant AgentDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(AgentDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: AgentDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<AgentDetailNotifier, Agent?>
      createElement() {
    return _AgentDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is AgentDetailNotifierProvider && other.id == id;
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
mixin AgentDetailNotifierRef on AutoDisposeAsyncNotifierProviderRef<Agent?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _AgentDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<AgentDetailNotifier, Agent?>
    with AgentDetailNotifierRef {
  _AgentDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as AgentDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
