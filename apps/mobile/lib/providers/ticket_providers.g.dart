// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ticket_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$ticketNotifierHash() => r'fb79c1f6cd79a2bb17a674ccf06439900d550f73';

/// See also [TicketNotifier].
@ProviderFor(TicketNotifier)
final ticketNotifierProvider =
    AutoDisposeAsyncNotifierProvider<TicketNotifier, List<Ticket>>.internal(
  TicketNotifier.new,
  name: r'ticketNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$ticketNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$TicketNotifier = AutoDisposeAsyncNotifier<List<Ticket>>;
String _$ticketDetailNotifierHash() =>
    r'efa91c8f8305a120c199ca2343549628d72a2492';

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

abstract class _$TicketDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Ticket?> {
  late final String id;

  FutureOr<Ticket?> build(
    String id,
  );
}

/// See also [TicketDetailNotifier].
@ProviderFor(TicketDetailNotifier)
const ticketDetailNotifierProvider = TicketDetailNotifierFamily();

/// See also [TicketDetailNotifier].
class TicketDetailNotifierFamily extends Family<AsyncValue<Ticket?>> {
  /// See also [TicketDetailNotifier].
  const TicketDetailNotifierFamily();

  /// See also [TicketDetailNotifier].
  TicketDetailNotifierProvider call(
    String id,
  ) {
    return TicketDetailNotifierProvider(
      id,
    );
  }

  @override
  TicketDetailNotifierProvider getProviderOverride(
    covariant TicketDetailNotifierProvider provider,
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
  String? get name => r'ticketDetailNotifierProvider';
}

/// See also [TicketDetailNotifier].
class TicketDetailNotifierProvider extends AutoDisposeAsyncNotifierProviderImpl<
    TicketDetailNotifier, Ticket?> {
  /// See also [TicketDetailNotifier].
  TicketDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => TicketDetailNotifier()..id = id,
          from: ticketDetailNotifierProvider,
          name: r'ticketDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$ticketDetailNotifierHash,
          dependencies: TicketDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              TicketDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  TicketDetailNotifierProvider._internal(
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
  FutureOr<Ticket?> runNotifierBuild(
    covariant TicketDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(TicketDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: TicketDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<TicketDetailNotifier, Ticket?>
      createElement() {
    return _TicketDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is TicketDetailNotifierProvider && other.id == id;
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
mixin TicketDetailNotifierRef on AutoDisposeAsyncNotifierProviderRef<Ticket?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _TicketDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<TicketDetailNotifier,
        Ticket?> with TicketDetailNotifierRef {
  _TicketDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as TicketDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
