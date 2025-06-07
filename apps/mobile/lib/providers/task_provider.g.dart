// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'task_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$taskServiceHash() => r'6d20f3723fd7783d01628ca85852abe86bbb44ca';

/// See also [taskService].
@ProviderFor(taskService)
final taskServiceProvider = AutoDisposeProvider<TaskService>.internal(
  taskService,
  name: r'taskServiceProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$taskServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef TaskServiceRef = AutoDisposeProviderRef<TaskService>;
String _$taskNotifierHash() => r'2676272340a750c0b4166a7fe14a00ea6569dc92';

/// See also [TaskNotifier].
@ProviderFor(TaskNotifier)
final taskNotifierProvider =
    AutoDisposeNotifierProvider<TaskNotifier, AsyncValue<Task?>>.internal(
  TaskNotifier.new,
  name: r'taskNotifierProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$taskNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$TaskNotifier = AutoDisposeNotifier<AsyncValue<Task?>>;
String _$taskListNotifierHash() => r'ad56dc571805a93913afa2408d58390de36989f6';

/// See also [TaskListNotifier].
@ProviderFor(TaskListNotifier)
final taskListNotifierProvider =
    AutoDisposeAsyncNotifierProvider<TaskListNotifier, List<Task>>.internal(
  TaskListNotifier.new,
  name: r'taskListNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$taskListNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$TaskListNotifier = AutoDisposeAsyncNotifier<List<Task>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
