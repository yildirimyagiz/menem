import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/task.dart';
import '../services/task_service.dart';
import 'api_provider.dart';
import 'dart:async';
part 'task_provider.g.dart';

@riverpod
// ignore: deprecated_member_use_from_same_package
TaskService taskService(TaskServiceRef ref) {
  final apiService = ref.watch(apiServiceProvider);
  return TaskService(apiService);
}

@riverpod
class TaskNotifier extends _$TaskNotifier {
  @override
  AsyncValue<Task?> build() => const AsyncValue.data(null);

  Future<void> getTask(String id) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      return await ref.read(taskServiceProvider).getTask(id);
    });
  }

  Future<void> createTask({
    required String title,
    required TaskType type,
    String? description,
    TaskStatus status = TaskStatus.todo,
    TaskPriority priority = TaskPriority.medium,
    String? createdById,
    String? assignedToId,
    String? propertyId,
    String? agentId,
    String? agencyId,
    DateTime? dueDate,
    DateTime? completedAt,
    String? facilityId,
    String? includedServiceId,
    String? extraChargeId,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      return await ref.read(taskServiceProvider).createTask(
            title: title,
            type: type,
            description: description,
            status: status,
            priority: priority,
            createdById: createdById,
            assignedToId: assignedToId,
            propertyId: propertyId,
            agentId: agentId,
            agencyId: agencyId,
            dueDate: dueDate,
            completedAt: completedAt,
            facilityId: facilityId,
            includedServiceId: includedServiceId,
            extraChargeId: extraChargeId,
          );
    });
  }

  Future<void> updateTask({
    required String id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskType? type,
    TaskPriority? priority,
    String? createdById,
    String? assignedToId,
    String? propertyId,
    String? agentId,
    String? agencyId,
    DateTime? dueDate,
    DateTime? completedAt,
    String? facilityId,
    String? includedServiceId,
    String? extraChargeId,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      return await ref.read(taskServiceProvider).updateTask(
            id: id,
            title: title,
            description: description,
            status: status,
            type: type,
            priority: priority,
            createdById: createdById,
            assignedToId: assignedToId,
            propertyId: propertyId,
            agentId: agentId,
            agencyId: agencyId,
            dueDate: dueDate,
            completedAt: completedAt,
            facilityId: facilityId,
            includedServiceId: includedServiceId,
            extraChargeId: extraChargeId,
          );
    });
  }

  Future<void> deleteTask(String id) async {
    state = const AsyncValue.loading();
    await AsyncValue.guard(() async {
      await ref.read(taskServiceProvider).deleteTask(id);
      return null;
    });
    state = const AsyncValue.data(null);
  }
}

@riverpod
class TaskListNotifier extends _$TaskListNotifier {
  @override
  FutureOr<List<Task>> build() async {
    return ref.read(taskServiceProvider).getTasks();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      return await ref.read(taskServiceProvider).getTasks();
    });
  }

  void filterTasksByQuery(String query, List<Task> allTasks) {
    final filtered = allTasks
        .where((task) =>
            task.title.toLowerCase().contains(query.toLowerCase()) ||
            (task.description?.toLowerCase().contains(query.toLowerCase()) ??
                false))
        .toList();
    state = AsyncValue.data(filtered);
  }

  void filterTasksClientSide({
    List<TaskStatus>? statuses,
    List<TaskPriority>? priorities,
    List<TaskType>? types,
    DateTime? dueDateFrom,
    DateTime? dueDateTo,
  }) {
    if (state.hasValue) {
      var filtered = state.value!;
      if (statuses != null && statuses.isNotEmpty) {
        filtered = filtered.where((t) => statuses.contains(t.status)).toList();
      }
      if (priorities != null && priorities.isNotEmpty) {
        filtered =
            filtered.where((t) => priorities.contains(t.priority)).toList();
      }
      if (types != null && types.isNotEmpty) {
        filtered = filtered.where((t) => types.contains(t.type)).toList();
      }
      if (dueDateFrom != null) {
        filtered = filtered
            .where((t) =>
                t.dueDate != null &&
                t.dueDate!
                    .isAfter(dueDateFrom.subtract(const Duration(days: 1))))
            .toList();
      }
      if (dueDateTo != null) {
        filtered = filtered
            .where((t) =>
                t.dueDate != null &&
                t.dueDate!.isBefore(dueDateTo.add(const Duration(days: 1))))
            .toList();
      }
      state = AsyncValue.data(filtered);
    } else {
      refresh();
    }
  }

  void sortTasks(String column, bool ascending) {
    state.whenData((tasks) {
      final sortedTasks = List<Task>.from(tasks);
      sortedTasks.sort((a, b) {
        int comparison;
        switch (column) {
          case 'title':
            comparison = a.title.compareTo(b.title);
            break;
          case 'status':
            comparison = a.status.index.compareTo(b.status.index);
            break;
          case 'priority':
            comparison = a.priority.index.compareTo(b.priority.index);
            break;
          case 'dueDate':
            comparison = (a.dueDate ?? DateTime(9999))
                .compareTo(b.dueDate ?? DateTime(9999));
            break;
          case 'type':
            comparison = a.type.index.compareTo(b.type.index);
            break;
          default:
            comparison = 0;
        }
        return ascending ? comparison : -comparison;
      });
      state = AsyncValue.data(sortedTasks);
    });
  }
}
