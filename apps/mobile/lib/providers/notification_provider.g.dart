// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$notificationServiceHash() =>
    r'841c588f74028a3fafda2fb906fcc13d92e49482';

/// Provider for the NotificationService
///
/// Copied from [notificationService].
@ProviderFor(notificationService)
final notificationServiceProvider =
    AutoDisposeProvider<NotificationService>.internal(
  notificationService,
  name: r'notificationServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$notificationServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef NotificationServiceRef = AutoDisposeProviderRef<NotificationService>;
String _$notificationsNotifierHash() =>
    r'4c5ace030c9da904892a0ca1886992f59be61437';

/// Notifier for managing a list of notifications
///
/// Copied from [NotificationsNotifier].
@ProviderFor(NotificationsNotifier)
final notificationsNotifierProvider = AutoDisposeAsyncNotifierProvider<
    NotificationsNotifier, List<Notification>>.internal(
  NotificationsNotifier.new,
  name: r'notificationsNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$notificationsNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$NotificationsNotifier = AutoDisposeAsyncNotifier<List<Notification>>;
String _$unreadNotificationsNotifierHash() =>
    r'54180452d142cbc7214da02b838df25e048f0675';

/// Notifier for managing unread notifications
///
/// Copied from [UnreadNotificationsNotifier].
@ProviderFor(UnreadNotificationsNotifier)
final unreadNotificationsNotifierProvider = AutoDisposeAsyncNotifierProvider<
    UnreadNotificationsNotifier, List<Notification>>.internal(
  UnreadNotificationsNotifier.new,
  name: r'unreadNotificationsNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$unreadNotificationsNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$UnreadNotificationsNotifier
    = AutoDisposeAsyncNotifier<List<Notification>>;
String _$notificationNotifierHash() =>
    r'b595464c2ead8ec4e9ca8b0552556bf4f2f05035';

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

abstract class _$NotificationNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Notification?> {
  late final String id;

  FutureOr<Notification?> build(
    String id,
  );
}

/// Notifier for managing a single notification
///
/// Copied from [NotificationNotifier].
@ProviderFor(NotificationNotifier)
const notificationNotifierProvider = NotificationNotifierFamily();

/// Notifier for managing a single notification
///
/// Copied from [NotificationNotifier].
class NotificationNotifierFamily extends Family<AsyncValue<Notification?>> {
  /// Notifier for managing a single notification
  ///
  /// Copied from [NotificationNotifier].
  const NotificationNotifierFamily();

  /// Notifier for managing a single notification
  ///
  /// Copied from [NotificationNotifier].
  NotificationNotifierProvider call(
    String id,
  ) {
    return NotificationNotifierProvider(
      id,
    );
  }

  @override
  NotificationNotifierProvider getProviderOverride(
    covariant NotificationNotifierProvider provider,
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
  String? get name => r'notificationNotifierProvider';
}

/// Notifier for managing a single notification
///
/// Copied from [NotificationNotifier].
class NotificationNotifierProvider extends AutoDisposeAsyncNotifierProviderImpl<
    NotificationNotifier, Notification?> {
  /// Notifier for managing a single notification
  ///
  /// Copied from [NotificationNotifier].
  NotificationNotifierProvider(
    String id,
  ) : this._internal(
          () => NotificationNotifier()..id = id,
          from: notificationNotifierProvider,
          name: r'notificationNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$notificationNotifierHash,
          dependencies: NotificationNotifierFamily._dependencies,
          allTransitiveDependencies:
              NotificationNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  NotificationNotifierProvider._internal(
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
  FutureOr<Notification?> runNotifierBuild(
    covariant NotificationNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(NotificationNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: NotificationNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<NotificationNotifier, Notification?>
      createElement() {
    return _NotificationNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is NotificationNotifierProvider && other.id == id;
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
mixin NotificationNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Notification?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _NotificationNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<NotificationNotifier,
        Notification?> with NotificationNotifierRef {
  _NotificationNotifierProviderElement(super.provider);

  @override
  String get id => (origin as NotificationNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
