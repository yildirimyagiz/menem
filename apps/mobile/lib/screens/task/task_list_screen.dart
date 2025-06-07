import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/task_provider.dart';
import '../../widgets/filter_dialogs/task_filter_dialog.dart';
import '../../widgets/task_status_chip.dart';
import '../../widgets/task_priority_chip.dart';

class TaskListScreen extends ConsumerStatefulWidget {
  const TaskListScreen({super.key});

  @override
  ConsumerState<TaskListScreen> createState() => _TaskListScreenState();
}

class _TaskListScreenState extends ConsumerState<TaskListScreen> {
  final _searchController = TextEditingController();
  bool _isSearching = false;
  String? _sortBy;
  bool _sortAscending = true;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(taskListNotifierProvider.notifier).refresh();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showSearchBar() {
    setState(() {
      _isSearching = true;
    });
  }

  void _hideSearchBar() {
    setState(() {
      _isSearching = false;
      _searchController.clear();
      ref.read(taskListNotifierProvider.notifier).refresh();
    });
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => const TaskFilterDialog(),
    );
  }

  void _sortTasks(String column) {
    setState(() {
      if (_sortBy == column) {
        _sortAscending = !_sortAscending;
      } else {
        _sortBy = column;
        _sortAscending = true;
      }
    });
    ref.read(taskListNotifierProvider.notifier).sortTasks(column, _sortAscending);
  }

  @override
  Widget build(BuildContext context) {
    final taskState = ref.watch(taskListNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search tasks...',
                  border: InputBorder.none,
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: _hideSearchBar,
                  ),
                ),
                onSubmitted: (value) {
                  final notifier = ref.read(taskListNotifierProvider.notifier);
                  if (value.isNotEmpty) {
                    // Client-side filter: filter tasks by title or description
                    final allTasks = ref.read(taskListNotifierProvider);
                    if (allTasks.hasValue) {
                      notifier.filterTasksByQuery(value, allTasks.value!);
                    }
                  } else {
                    // If search is cleared, reload all tasks
                    notifier.refresh();
                  }
                },
              )
            : const Text('Tasks'),
        leading: _isSearching
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: _hideSearchBar,
              )
            : null,
        actions: [
          if (!_isSearching)
            IconButton(
              icon: const Icon(Icons.search),
              onPressed: _showSearchBar,
            ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // TODO: Navigate to create task screen
            },
          ),
        ],
      ),
      body: taskState.when(
        data: (tasks) {
          if (tasks.isEmpty) {
            return const Center(
              child: Text('No tasks found'),
            );
          }

          return SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: SingleChildScrollView(
              child: DataTable(
                sortColumnIndex: _sortBy == null
                    ? null
                    : {
                        'title': 0,
                        'status': 1,
                        'priority': 2,
                        'dueDate': 3,
                        'type': 4,
                      }[_sortBy],
                sortAscending: _sortAscending,
                columns: [
                  DataColumn(
                    label: const Text('Title'),
                    onSort: (_, __) => _sortTasks('title'),
                  ),
                  DataColumn(
                    label: const Text('Status'),
                    onSort: (_, __) => _sortTasks('status'),
                  ),
                  DataColumn(
                    label: const Text('Priority'),
                    onSort: (_, __) => _sortTasks('priority'),
                  ),
                  DataColumn(
                    label: const Text('Due Date'),
                    onSort: (_, __) => _sortTasks('dueDate'),
                  ),
                  DataColumn(
                    label: const Text('Type'),
                    onSort: (_, __) => _sortTasks('type'),
                  ),
                  const DataColumn(label: Text('Assigned To')),
                  const DataColumn(label: Text('Actions')),
                ],
                rows: tasks.map((task) {
                  return DataRow(
                    cells: [
                      DataCell(
                        Text(
                          task.title,
                          style: TextStyle(
                            fontWeight: task.isOverdue
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                      DataCell(TaskStatusChip(status: task.status)),
                      DataCell(TaskPriorityChip(priority: task.priority)),
                      DataCell(
                        Text(
                          task.dueDate != null
                              ? DateFormat('MMM d, y').format(task.dueDate!)
                              : 'No due date',
                          style: TextStyle(
                            color: task.isOverdue ? Colors.red : null,
                          ),
                        ),
                      ),
                      DataCell(Text(task.type.toString().split('.').last)),
                      DataCell(
                        Text(task.assignedTo?.name ?? 'Unassigned'),
                      ),
                      DataCell(
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit),
                              onPressed: () {
                                // TODO: Navigate to edit task screen
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () {
                                // TODO: Show delete confirmation dialog
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Error: ${error.toString()}'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.read(taskListNotifierProvider.notifier).refresh();
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
