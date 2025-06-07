// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$messageServiceHash() => r'e6f45866b0f140917a83c63387755e8373d07583';

/// See also [messageService].
@ProviderFor(messageService)
final messageServiceProvider = AutoDisposeProvider<MessageService>.internal(
  messageService,
  name: r'messageServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$messageServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef MessageServiceRef = AutoDisposeProviderRef<MessageService>;
String _$messageNotifierHash() => r'aa6214de6c0ed9a4b9ca960fa18f500d961ccf3b';

/// See also [MessageNotifier].
@ProviderFor(MessageNotifier)
final messageNotifierProvider =
    AutoDisposeAsyncNotifierProvider<MessageNotifier, List<Message>>.internal(
  MessageNotifier.new,
  name: r'messageNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$messageNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$MessageNotifier = AutoDisposeAsyncNotifier<List<Message>>;
String _$messageDetailNotifierHash() =>
    r'99da0acd222c9e90a99a75a1cfd0591acba527d5';

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

abstract class _$MessageDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Message?> {
  late final String id;

  FutureOr<Message?> build(
    String id,
  );
}

/// See also [MessageDetailNotifier].
@ProviderFor(MessageDetailNotifier)
const messageDetailNotifierProvider = MessageDetailNotifierFamily();

/// See also [MessageDetailNotifier].
class MessageDetailNotifierFamily extends Family<AsyncValue<Message?>> {
  /// See also [MessageDetailNotifier].
  const MessageDetailNotifierFamily();

  /// See also [MessageDetailNotifier].
  MessageDetailNotifierProvider call(
    String id,
  ) {
    return MessageDetailNotifierProvider(
      id,
    );
  }

  @override
  MessageDetailNotifierProvider getProviderOverride(
    covariant MessageDetailNotifierProvider provider,
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
  String? get name => r'messageDetailNotifierProvider';
}

/// See also [MessageDetailNotifier].
class MessageDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<MessageDetailNotifier,
        Message?> {
  /// See also [MessageDetailNotifier].
  MessageDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => MessageDetailNotifier()..id = id,
          from: messageDetailNotifierProvider,
          name: r'messageDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$messageDetailNotifierHash,
          dependencies: MessageDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              MessageDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  MessageDetailNotifierProvider._internal(
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
  FutureOr<Message?> runNotifierBuild(
    covariant MessageDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(MessageDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: MessageDetailNotifierProvider._internal(
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
  AutoDisposeAsyncNotifierProviderElement<MessageDetailNotifier, Message?>
      createElement() {
    return _MessageDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is MessageDetailNotifierProvider && other.id == id;
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
mixin MessageDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Message?> {
  /// The parameter `id` of this provider.
  String get id;
}

class _MessageDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<MessageDetailNotifier,
        Message?> with MessageDetailNotifierRef {
  _MessageDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as MessageDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
