// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'event_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$eventServiceHash() => r'97d6ea1088f6558a842acb4f54134b13e63b71c4';

/// See also [eventService].
@ProviderFor(eventService)
final eventServiceProvider = AutoDisposeProvider<EventService>.internal(
  eventService,
  name: r'eventServiceProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$eventServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef EventServiceRef = AutoDisposeProviderRef<EventService>;
String _$eventNotifierHash() => r'edeeb7a1efd09b7379fe6604c0553745b67ee82d';

/// See also [EventNotifier].
@ProviderFor(EventNotifier)
final eventNotifierProvider =
    AutoDisposeAsyncNotifierProvider<EventNotifier, List<Event>>.internal(
  EventNotifier.new,
  name: r'eventNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$eventNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$EventNotifier = AutoDisposeAsyncNotifier<List<Event>>;
String _$eventDetailNotifierHash() =>
    r'7d31c54bea59773d41492e5927480bc3b4139f00';

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

abstract class _$EventDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Event?> {
  late final String id;

  FutureOr<Event?> build(
    String id,
  );
}

/// See also [EventDetailNotifier].
@ProviderFor(EventDetailNotifier)
const eventDetailNotifierProvider = EventDetailNotifierFamily();

/// See also [EventDetailNotifier].
class EventDetailNotifierFamily extends Family<AsyncValue<Event?>> {
  /// See also [EventDetailNotifier].
  const EventDetailNotifierFamily();

  /// See also [EventDetailNotifier].
  EventDetailNotifierProvider call(
    String id,
  ) {
    return EventDetailNotifierProvider(
      id,
    );
  }

  @override
  EventDetailNotifierProvider getProviderOverride(
    covariant EventDetailNotifierProvider provider,
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
  String? get name => r'eventDetailNotifierProvider';
}

/// See also [EventDetailNotifier].
class EventDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<EventDetailNotifier, Event?> {
  /// See also [EventDetailNotifier].
  EventDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => EventDetailNotifier()..id = id,
          from: eventDetailNotifierProvider,
          name: r'eventDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$eventDetailNotifierHash,
          dependencies: EventDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              EventDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  EventDetailNotifierProvider._internal(
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
  FutureOr<Event?> runNotifierBuild(
    covariant EventDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(EventDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: EventDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<EventDetailNotifier, Event?>
      createElement() {
    return _EventDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is EventDetailNotifierProvider && other.id == id;
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
mixin EventDetailNotifierRef on AutoDisposeAsyncNotifierProviderRef<Event?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _EventDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<EventDetailNotifier, Event?>
    with EventDetailNotifierRef {
  _EventDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as EventDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
