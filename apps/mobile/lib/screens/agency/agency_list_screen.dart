import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/agency_provider.dart';
import '../../widgets/agency_status_chip.dart';
import 'agency_form_screen.dart';

class AgencyListScreen extends ConsumerStatefulWidget {
  const AgencyListScreen({super.key});

  @override
  ConsumerState<AgencyListScreen> createState() => _AgencyListScreenState();
}

class _AgencyListScreenState extends ConsumerState<AgencyListScreen> {
  final _searchController = TextEditingController();
  bool _isSearching = false;
  String? _sortBy;
  bool _sortAscending = true;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(agencyListProvider.notifier).refresh();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _hideSearchBar() {
    setState(() {
      _isSearching = false;
      _searchController.clear();
      ref.read(agencyListProvider.notifier).refresh();
    });
  }

  void _sortAgencies(String column) {
    setState(() {
      if (_sortBy == column) {
        _sortAscending = !_sortAscending;
      } else {
        _sortBy = column;
        _sortAscending = true;
      }
    });
    ref.read(agencyListProvider.notifier).sortAgencies(column, _sortAscending);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search agencies...',
                  border: InputBorder.none,
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: _hideSearchBar,
                  ),
                ),
                onSubmitted: (value) {
                  if (value.isNotEmpty) {
                    ref.read(agencyListProvider.notifier).searchAgencies(value);
                  }
                },
              )
            : const Text('Agencies'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const AgencyFormScreen(),
            ),
          );
        },
        child: const Icon(Icons.add),
      ),
      body: Consumer(
        builder: (context, ref, child) {
          final agenciesAsync = ref.watch(agencyListProvider);

          return agenciesAsync.when(
            data: (agencies) {
              if (agencies.isEmpty) {
                return const Center(
                  child: Text('No agencies found'),
                );
              }

              return RefreshIndicator(
                onRefresh: () =>
                    ref.read(agencyListProvider.notifier).refresh(),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: SingleChildScrollView(
                    child: DataTable(
                      sortColumnIndex: _sortBy == null
                          ? null
                          : {
                              'name': 0,
                              'status': 1,
                              'email': 2,
                              'createdAt': 3,
                            }[_sortBy],
                      sortAscending: _sortAscending,
                      columns: [
                        DataColumn(
                            label: const Text('Name'),
                            onSort: (_, __) => _sortAgencies('name')),
                        DataColumn(
                            label: const Text('Status'),
                            onSort: (_, __) => _sortAgencies('status')),
                        DataColumn(
                            label: const Text('Email'),
                            onSort: (_, __) => _sortAgencies('email')),
                        const DataColumn(label: Text('Phone')),
                        const DataColumn(label: Text('Address')),
                        const DataColumn(label: Text('Website')),
                        const DataColumn(label: Text('Logo')),
                        const DataColumn(label: Text('Active')),
                        const DataColumn(label: Text('Owner ID')),
                        const DataColumn(label: Text('Theme')),
                        const DataColumn(label: Text('External ID')),
                        const DataColumn(label: Text('Settings')), // count
                        const DataColumn(label: Text('Integration')), // count
                        DataColumn(
                            label: const Text('Created At'),
                            onSort: (_, __) => _sortAgencies('createdAt')),
                        const DataColumn(label: Text('Updated At')),
                        const DataColumn(label: Text('Deleted At')),
                        const DataColumn(label: Text('Actions')),
                      ],
                      rows: agencies.map((agency) {
                        return DataRow(
                          cells: [
                            // Name + logo
                            DataCell(Row(
                              children: [
                                if (agency.logoUrl != null)
                                  Padding(
                                    padding: const EdgeInsets.only(right: 8),
                                    child: CircleAvatar(
                                      backgroundImage:
                                          NetworkImage(agency.logoUrl!),
                                      radius: 16,
                                    ),
                                  ),
                                Expanded(
                                    child: Text(agency.name,
                                        overflow: TextOverflow.ellipsis)),
                              ],
                            )),
                            DataCell(AgencyStatusChip(status: agency.status)),
                            DataCell(Text(agency.email ?? '-')),
                            DataCell(Text(agency.phone ?? '-')),
                            DataCell(Text(agency.address ?? '-',
                                maxLines: 1, overflow: TextOverflow.ellipsis)),
                            DataCell(Text(agency.website ?? '-',
                                maxLines: 1, overflow: TextOverflow.ellipsis)),
                            DataCell(agency.logoUrl != null
                                ? Tooltip(
                                    message: agency.logoUrl!,
                                    child: const Icon(Icons.image))
                                : const Text('-')),
                            DataCell(Text(agency.isActive ? 'Yes' : 'No')),
                            DataCell(Text(agency.ownerId ?? '-')),
                            DataCell(Text(agency.theme ?? '-')),
                            DataCell(Text(agency.externalId ?? '-')),
                            DataCell(Text(agency.settings != null
                                ? agency.settings!.length.toString()
                                : '0')),
                            DataCell(Text(agency.integration != null
                                ? agency.integration!.length.toString()
                                : '0')),
                            DataCell(Text(agency.createdAt != null
                                ? DateFormat('MMM d, y')
                                    .format(agency.createdAt!)
                                : 'N/A')),
                            DataCell(Text(agency.updatedAt != null
                                ? DateFormat('MMM d, y')
                                    .format(agency.updatedAt!)
                                : 'N/A')),
                            DataCell(Text(agency.deletedAt != null
                                ? DateFormat('MMM d, y')
                                    .format(agency.deletedAt!)
                                : '-')),
                            DataCell(Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.edit),
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            AgencyFormScreen(agency: agency),
                                      ),
                                    );
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete),
                                  onPressed: () async {
                                    final confirmed = await showDialog<bool>(
                                      context: context,
                                      builder: (context) => AlertDialog(
                                        title: const Text('Delete Agency'),
                                        content: const Text(
                                            'Are you sure you want to delete this agency?'),
                                        actions: [
                                          TextButton(
                                            onPressed: () =>
                                                Navigator.pop(context, false),
                                            child: const Text('Cancel'),
                                          ),
                                          TextButton(
                                            onPressed: () =>
                                                Navigator.pop(context, true),
                                            child: const Text('Delete'),
                                          ),
                                        ],
                                      ),
                                    );

                                    if (confirmed == true && context.mounted) {
                                      try {
                                        await ref
                                            .read(agencyListProvider.notifier)
                                            .deleteAgency(agency.id);
                                      } catch (e) {
                                        if (context.mounted) {
                                          ScaffoldMessenger.of(context)
                                              .showSnackBar(
                                            const SnackBar(
                                              content: Text(
                                                  'Failed to delete agency. Please try again.'),
                                            ),
                                          );
                                        }
                                      }
                                    }
                                  },
                                ),
                              ],
                            )),
                          ],
                        );
                      }).toList(),
                    ),
                  ),
                ),
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, stackTrace) => Center(
              child: Text('Error: $error'),
            ),
          );
        },
      ),
    );
  }
}
