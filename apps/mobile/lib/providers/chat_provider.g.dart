// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$webSocketServiceHash() => r'9b494fd712bcb349a0abbdc64a39fd4bef3f5916';

/// See also [webSocketService].
@ProviderFor(webSocketService)
final webSocketServiceProvider = AutoDisposeProvider<WebSocketService>.internal(
  webSocketService,
  name: r'webSocketServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$webSocketServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef WebSocketServiceRef = AutoDisposeProviderRef<WebSocketService>;
String _$chatServiceHash() => r'67799452f3652a0ea8300df01d30039e15490962';

/// See also [chatService].
@ProviderFor(chatService)
final chatServiceProvider = AutoDisposeProvider<ChatService>.internal(
  chatService,
  name: r'chatServiceProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$chatServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ChatServiceRef = AutoDisposeProviderRef<ChatService>;
String _$chatThreadMessagesHash() =>
    r'd793cb93ca118abf06349f3821715cdf218ba695';

/// See also [ChatThreadMessages].
@ProviderFor(ChatThreadMessages)
final chatThreadMessagesProvider = AutoDisposeAsyncNotifierProvider<
    ChatThreadMessages, List<CommunicationLog>>.internal(
  ChatThreadMessages.new,
  name: r'chatThreadMessagesProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$chatThreadMessagesHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ChatThreadMessages = AutoDisposeAsyncNotifier<List<CommunicationLog>>;
String _$chatListHash() => r'4b5552b7dbbe628d4165ac52a2635865e7997b36';

/// See also [ChatList].
@ProviderFor(ChatList)
final chatListProvider =
    AutoDisposeAsyncNotifierProvider<ChatList, List<CommunicationLog>>.internal(
  ChatList.new,
  name: r'chatListProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$chatListHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ChatList = AutoDisposeAsyncNotifier<List<CommunicationLog>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
