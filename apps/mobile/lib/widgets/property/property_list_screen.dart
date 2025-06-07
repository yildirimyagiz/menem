import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/models/property.dart'; // This now re-exports all enums from property_enums.dart
import 'package:mobile/providers/property_provider.dart';
import 'package:mobile/widgets/commons/empty_state.dart';
import 'package:mobile/widgets/commons/error_state.dart';

// Import your property Riverpod provider for 'all' query and delete mutation
// import 'package:mobile/providers/admin_property_provider.dart'; // Example: adminPropertyServiceProvider

// Example Admin Properties Provider (replace with your actual implementation)
final adminPropertiesProvider = StateNotifierProvider.autoDispose<
    AdminPropertiesNotifier, AsyncValue<List<Property>>>((ref) {
  // final apiService = ref.watch(adminPropertyServiceProvider);
  return AdminPropertiesNotifier();
});

class AdminPropertiesNotifier
    extends StateNotifier<AsyncValue<List<Property>>> {
  Map<String, dynamic> _currentFilters = {'page': 1};
  int _page = 1;
  int _limit = 10;
  int _total = 0;

  AdminPropertiesNotifier() : super(const AsyncValue.loading()) {
    fetchProperties();
  }

  int get page => _page;
  int get limit => _limit;
  int get total => _total;
  int get pageCount => (_total / _limit).ceil();

  Future<void> fetchProperties({Map<String, dynamic>? filters}) async {
    _currentFilters = filters ?? _currentFilters;
    state = const AsyncValue.loading();
    try {
      final container = ProviderContainer();
      final propertyService = container.read(propertyServiceProvider);
      final paged = await propertyService.getProperties(
        page: _currentFilters['page'] ?? 1,
        limit: _currentFilters['limit'] ?? 10,
        searchTerm: _currentFilters['title'],
        status: _currentFilters['status'],
        type: _currentFilters['type'],
      );
      _page = paged.page;
      _limit = paged.limit;
      _total = paged.total;
      state = AsyncValue.data(paged.data);
    } catch (e, s) {
      state = AsyncValue.error(e, s);
    }
  }

  void applyFilters(Map<String, dynamic> newFilters) {
    _currentFilters = {..._currentFilters, ...newFilters, 'page': 1};
    fetchProperties(filters: _currentFilters);
  }

  void goToPage(int page) {
    _currentFilters['page'] = page;
    fetchProperties(filters: _currentFilters);
  }
}

class AdminPropertyListScreen extends ConsumerStatefulWidget {
  const AdminPropertyListScreen({super.key});

  @override
  ConsumerState<AdminPropertyListScreen> createState() =>
      _AdminPropertyListScreenState();
}

class _AdminPropertyListScreenState
    extends ConsumerState<AdminPropertyListScreen> {
  // Add state for filters if needed, e.g., TextEditingController for search
  String _searchTerm = "";
  PropertyStatus? _selectedStatus;
  PropertyType?
      _selectedType; // Changed from Category to Type to match Next.js example

  void _applyFilters() {
    final filters = {
      'page': 1, // Add pagination state later
      'status': _selectedStatus?.name,
      'type': _selectedType?.name, // Changed from category
      'title': _searchTerm.isNotEmpty ? _searchTerm : null,
    };
    // Remove null values from filters
    filters.removeWhere((key, value) => value == null);
    ref.read(adminPropertiesProvider.notifier).applyFilters(filters);
  }

  // Debouncer for search
  final Debouncer _debouncer = Debouncer(milliseconds: 500);

  Map<String, dynamic> _getApiFilters() {
    return {
      'status': _selectedStatus?.name,
      'type': _selectedType?.name,
      'title': _searchTerm.isNotEmpty ? _searchTerm : null,
      'page': 1,
    }..removeWhere((key, value) => value == null);
  }

  @override
  Widget build(BuildContext context) {
    final propertiesAsyncValue = ref.watch(adminPropertiesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Properties'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () async {
              final result = await Navigator.of(context).push<bool?>(
                MaterialPageRoute(
                    builder: (_) =>
                        const AdminPropertyFormScreen()), // Use AdminPropertyFormScreen
              );
              if (result == true) {
                ref
                    .read(adminPropertiesProvider.notifier)
                    .fetchProperties(); // Refresh list
              }
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter UI (already implemented, just removing TODO comment)
          Container(
            padding: const EdgeInsets.all(8.0),
            color: Theme.of(context).cardColor,
            child: Column(
              children: [
                TextField(
                    decoration: const InputDecoration(
                        labelText: 'Search Properties',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.search)),
                    onChanged: (value) {
                      _debouncer.run(() {
                        setState(() => _searchTerm = value);
                        _applyFilters();
                      });
                    }),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<PropertyStatus>(
                        decoration: const InputDecoration(
                            labelText: 'Status', border: OutlineInputBorder()),
                        value: _selectedStatus,
                        items: [
                          const DropdownMenuItem(
                              value: null, child: Text('All Statuses')),
                          ...PropertyStatus.values.map((s) =>
                              DropdownMenuItem(value: s, child: Text(s.name)))
                        ],
                        onChanged: (value) {
                          setState(() => _selectedStatus = value);
                          _applyFilters();
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: DropdownButtonFormField<PropertyType>(
                        decoration: const InputDecoration(
                            labelText: 'Type', border: OutlineInputBorder()),
                        value: _selectedType,
                        items: [
                          const DropdownMenuItem(
                              value: null, child: Text('All Types')),
                          ...PropertyType.values.map((t) =>
                              DropdownMenuItem(value: t, child: Text(t.name)))
                        ],
                        onChanged: (value) {
                          setState(() => _selectedType = value);
                          _applyFilters();
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          Expanded(
            child: propertiesAsyncValue.when(
              data: (properties) {
                // properties is List<Property>
                if (properties.isEmpty) {
                  return const EmptyState(
                      message:
                          'No properties found. Try adjusting your filters.',
                      icon: Icons.search_off);
                }
                return ListView.builder(
                  padding: const EdgeInsets.only(top: 8),
                  itemCount: properties.length,
                  itemBuilder: (context, index) {
                    final property = properties[
                        index]; // This is your Property model instance
                    return Card(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      child: ListTile(
                        title: Text(property.title),
                        subtitle: Text(
                            '${property.address ?? ''}, ${property.city ?? ''}'),
                        trailing: PopupMenuButton<String>(
                          // Ensure property.id is a String
                          onSelected: (value) async {
                            if (value == 'view') {
                              Navigator.of(context).push(MaterialPageRoute(
                                  builder: (_) => AdminPropertyDetailScreen(
                                      propertyId: property
                                          .id))); // Ensure this screen exists
                            } else if (value == 'edit') {
                              final result = await Navigator.of(context)
                                  .push<bool?>(MaterialPageRoute(
                                      builder: (_) => AdminPropertyFormScreen(
                                          // Use AdminPropertyFormScreen
                                          initialProperty: property)));
                              if (result == true) {
                                ref
                                    .read(adminPropertiesProvider.notifier)
                                    .fetchProperties();
                              }
                            } else if (value == 'delete') {
                              // Show confirmation dialog then call delete mutation
                              // await ref.read(adminPropertyNotifierProvider.notifier).deleteProperty(property.id);
                              // ref.invalidate(adminPropertiesProvider);
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                  content: Text(
                                      'Delete action for ${property.title} (Mock)')));
                            }
                          },
                          itemBuilder: (BuildContext context) =>
                              <PopupMenuEntry<String>>[
                            const PopupMenuItem<String>(
                                value: 'view', child: Text('View')),
                            const PopupMenuItem<String>(
                                value: 'edit', child: Text('Edit')),
                            const PopupMenuItem<String>(
                                value: 'delete',
                                child: Text('Delete',
                                    style: TextStyle(color: Colors.red))),
                          ],
                        ),
                        onTap: () {
                          Navigator.of(context).push(MaterialPageRoute(
                              builder: (_) => AdminPropertyDetailScreen(
                                  propertyId: property.id)));
                        },
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => ErrorState(
                  message: 'Error: ${err.toString()}',
                  onRetry: () => ref
                      .read(adminPropertiesProvider.notifier)
                      .fetchProperties()),
            ),
          ),
          // Pagination UI
          Builder(
            builder: (context) {
              final notifier = ref.read(adminPropertiesProvider.notifier);
              final page = notifier.page;
              final pageCount = notifier.pageCount;
              return Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.chevron_left),
                    onPressed: page > 1
                        ? () => setState(() => notifier.goToPage(page - 1))
                        : null,
                  ),
                  Text('Page $page of $pageCount'),
                  IconButton(
                    icon: const Icon(Icons.chevron_right),
                    onPressed: page < pageCount
                        ? () => setState(() => notifier.goToPage(page + 1))
                        : null,
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

// Placeholder for AdminPropertyFormScreen, AdminPropertyDetailScreen
// You should have these implemented properly.
class AdminPropertyFormScreen extends StatelessWidget {
  final Property? initialProperty;
  const AdminPropertyFormScreen({super.key, this.initialProperty});
  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text("Property Form")),
      body:
          const Center(child: Text("Admin Property Form Screen Placeholder")));
}

class AdminPropertyDetailScreen extends StatelessWidget {
  final String propertyId;
  const AdminPropertyDetailScreen({super.key, required this.propertyId});
  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text("Property Details")),
      body: Center(
          child: Text("Admin Property Detail Screen for ID: $propertyId")));
}

// Debouncer class
class Debouncer {
  final int milliseconds;
  VoidCallback? action;
  Timer? _timer;

  Debouncer({required this.milliseconds});

  run(VoidCallback action) {
    if (_timer != null) {
      _timer!.cancel();
    }
    _timer = Timer(Duration(milliseconds: milliseconds), action);
  }
}
