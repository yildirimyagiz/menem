import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/providers/property_provider.dart';

import '../../widgets/cards/property_card.dart';
import 'package:mobile/components/layouts/client_layout.dart';
import '../../widgets/logical_sized_box.dart';
import '../../models/property.dart';

class PropertyListScreen extends ConsumerStatefulWidget {
  const PropertyListScreen({super.key});

  @override
  ConsumerState<PropertyListScreen> createState() => _PropertyListScreenState();
}

class _PropertyListScreenState extends ConsumerState<PropertyListScreen> {
  final _searchController = TextEditingController();
  bool _isSearching = false;
  final Set<PropertyType> _selectedTypes = {};
  final Set<PropertyStatus> _selectedStatuses = {};
  final Set<PropertyCategory> _selectedCategories = {};

  @override
  void initState() {
    super.initState();
    ref.read(propertyNotifierProvider.notifier).refresh();
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
      ref.read(propertyNotifierProvider.notifier).refresh();
    });
  }

  void _applyFilters() {
    ref.read(propertyNotifierProvider.notifier).filterProperties(
          types: _selectedTypes.toList(),
          statuses: _selectedStatuses.toList(),
          categories: _selectedCategories.toList(),
        );
  }

  void _resetFilters() {
    setState(() {
      _selectedTypes.clear();
      _selectedStatuses.clear();
      _selectedCategories.clear();
    });
    ref.read(propertyNotifierProvider.notifier).refresh();
  }

  void _showFilterDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Theme.of(context).scaffoldBackgroundColor,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(16),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Text(
                'Filter Properties',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const LogicalSizedBox(blockSize: 16),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildFilterSection(
                        'Property Type',
                        PropertyType.values,
                        _selectedTypes,
                        (type) {
                          setState(() {
                            if (_selectedTypes.contains(type)) {
                              _selectedTypes.remove(type);
                            } else {
                              _selectedTypes.add(type);
                            }
                          });
                        },
                      ),
                      const LogicalSizedBox(blockSize: 16),
                      _buildFilterSection(
                        'Property Status',
                        PropertyStatus.values,
                        _selectedStatuses,
                        (status) {
                          setState(() {
                            if (_selectedStatuses.contains(status)) {
                              _selectedStatuses.remove(status);
                            } else {
                              _selectedStatuses.add(status);
                            }
                          });
                        },
                      ),
                      const LogicalSizedBox(blockSize: 16),
                      _buildFilterSection(
                        'Property Category',
                        PropertyCategory.values,
                        _selectedCategories,
                        (category) {
                          setState(() {
                            if (_selectedCategories.contains(category)) {
                              _selectedCategories.remove(category);
                            } else {
                              _selectedCategories.add(category);
                            }
                          });
                        },
                      ),
                      const LogicalSizedBox(blockSize: 24),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                _resetFilters();
                                Navigator.pop(context);
                              },
                              child: const Text('Reset'),
                            ),
                          ),
                          const LogicalSizedBox(inlineSize: 16),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () {
                                _applyFilters();
                                Navigator.pop(context);
                              },
                              child: const Text('Apply'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterSection<T>(
    String title,
    List<T> options,
    Set<T> selectedOptions,
    Function(T) onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const LogicalSizedBox(blockSize: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: options.map((option) {
            return FilterChip(
              label: Text(option.toString().split('.').last),
              selected: selectedOptions.contains(option),
              onSelected: (selected) {
                onChanged(option);
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final propertyState = ref.watch(propertyNotifierProvider);

    return ClientLayout(
      child: Column(
        children: [
          // Search and filter bar (formerly AppBar)
          Row(
            children: [
              Expanded(
                child: _isSearching
                    ? TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: 'Search properties...',
                          border: InputBorder.none,
                          suffixIcon: IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: _hideSearchBar,
                          ),
                        ),
                        onSubmitted: (value) {
                          if (value.isNotEmpty) {
                            ref
                                .read(propertyNotifierProvider.notifier)
                                .searchProperties(value);
                          }
                        },
                      )
                    : const Text('Properties',
                        style: TextStyle(
                            fontSize: 22, fontWeight: FontWeight.bold)),
              ),
              if (_isSearching)
                IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: _hideSearchBar,
                ),
              if (!_isSearching)
                IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: _showSearchBar,
                ),
              IconButton(
                icon: const Icon(Icons.filter_list),
                onPressed: _showFilterDialog,
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Main property list
          Expanded(
            child: propertyState.when(
              data: (properties) {
                if (properties.isEmpty) {
                  return const Center(
                    child: Text('No properties found'),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: properties.length,
                  itemBuilder: (context, index) {
                    final property = properties[index];
                    return Column(
                      children: [
                        PropertyCard(property: property),
                        const LogicalSizedBox(blockSize: 16),
                      ],
                    );
                  },
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              error: (error, stackTrace) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Error: {error.toString()}'),
                    const LogicalSizedBox(blockSize: 16),
                    ElevatedButton(
                      onPressed: () {
                        ref.read(propertyNotifierProvider.notifier).refresh();
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
