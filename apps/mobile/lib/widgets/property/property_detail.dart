import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/providers/property_provider.dart';
import 'package:mobile/widgets/property/edit_property.dart';
import 'package:mobile/models/property.dart';

final propertyDetailProvider =
    FutureProvider.autoDispose.family<Property?, String>((ref, id) async {
  try {
    // Use propertyServiceProvider to get the property by ID
    final propertyService = ref.watch(propertyServiceProvider);
    final property = await propertyService.getPropertyById(id);
    return property;
  } catch (e) {
    debugPrint('Error loading property details: $e');
    rethrow;
  }
});

class AdminPropertyDetailScreen extends ConsumerWidget {
  final String propertyId;

  const AdminPropertyDetailScreen({super.key, required this.propertyId});

  // Helper to format enum values (similar to your Next.js helper)
  String _formatEnumValue(String? value) {
    if (value == null) return 'N/A';
    return value
        .replaceAll('_', ' ')
        .toLowerCase()
        .split(' ')
        .map((word) => '${word[0].toUpperCase()}${word.substring(1)}')
        .join(' ');
  }

  Widget _buildDetailRow(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 120,
              child: Text(label,
                  style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value ?? 'N/A')),
        ],
      ),
    );
  }

  Widget _buildChipList(String title, List<dynamic>? items) {
    if (items == null || items.isEmpty) {
      return _buildDetailRow(title, 'None');
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 4),
        Wrap(
          spacing: 8.0,
          runSpacing: 4.0,
          children: items.map((item) {
            // Assuming item is an enum or has a 'name' property
            final String itemName = item is Enum ? item.name : item.toString();
            return Chip(label: Text(_formatEnumValue(itemName)));
          }).toList(),
        ),
        const SizedBox(height: 8),
      ],
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final propertyAsyncValue = ref.watch(propertyDetailProvider(propertyId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                    builder: (_) =>
                        AdminPropertyEditScreen(propertyId: propertyId)),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete, color: Colors.red),
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Confirm Delete'),
                  content: const Text(
                      'Are you sure you want to delete this property?'),
                  actions: [
                    TextButton(
                        onPressed: () => Navigator.of(ctx).pop(false),
                        child: const Text('Cancel')),
                    TextButton(
                        onPressed: () => Navigator.of(ctx).pop(true),
                        child: const Text('Delete',
                            style: TextStyle(color: Colors.red))),
                  ],
                ),
              );
              if (confirm == true) {
                if (!context.mounted) return;
                try {
                  final propertyService = ref.read(propertyServiceProvider);
                  await propertyService.deleteProperty(propertyId);
                  if (!context.mounted) return;

                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Property deleted successfully')),
                  );

                  if (context.mounted) {
                    Navigator.of(context).pop();
                  }
                } catch (e) {
                  if (!context.mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Failed to delete property: $e'),
                      backgroundColor: Theme.of(context).colorScheme.error,
                    ),
                  );
                }
              }
            },
          ),
        ],
      ),
      body: propertyAsyncValue.when(
        data: (property) {
          if (property == null) {
            return const Center(child: Text('Property not found.'));
          }
          // Using DefaultTabController for tabs, similar to your Next.js page
          return DefaultTabController(
            length: 4, // Overview, Features, Location, Gallery
            child: Column(
              children: [
                const TabBar(tabs: [
                  Tab(text: 'Overview'),
                  Tab(text: 'Features'),
                  Tab(text: 'Location'),
                  Tab(text: 'Gallery'),
                ]),
                Expanded(
                  child: TabBarView(children: [
                    // Overview Tab
                    ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        _buildDetailRow(
                            'Title',
                            property
                                .title), // Required field, no need for null check
                        _buildDetailRow('Description', property.description),
                        _buildDetailRow(
                          'Type',
                          _formatEnumValue(
                              property.propertyType.toString().split('.').last),
                        ),
                        _buildDetailRow(
                          'Status',
                          _formatEnumValue(property.propertyStatus
                              .toString()
                              .split('.')
                              .last),
                        ),
                        _buildDetailRow(
                          'Category',
                          _formatEnumValue(
                              property.category.toString().split('.').last),
                        ),
                        if (property.condition != null)
                          _buildDetailRow(
                            'Condition',
                            _formatEnumValue(
                                property.condition.toString().split('.').last),
                          ),
                        _buildDetailRow('Property Number',
                            property.propertyNumber), // Required field
                        if (property.marketValue != null)
                          _buildDetailRow('Market Value',
                              '\$${property.marketValue!.toStringAsFixed(2)}'),
                        if (property.bedrooms != null)
                          _buildDetailRow(
                              'Bedrooms', property.bedrooms.toString()),
                        if (property.bathrooms != null)
                          _buildDetailRow(
                              'Bathrooms', property.bathrooms.toString()),
                        if (property.yearBuilt != null)
                          _buildDetailRow(
                              'Year Built', property.yearBuilt.toString()),
                      ],
                    ),
                    // Features Tab
                    ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        if (property.features != null &&
                            property.features!.isNotEmpty)
                          _buildChipList('Features', property.features!),
                        if (property.amenities != null &&
                            property.amenities!.isNotEmpty)
                          _buildChipList('Amenities', property.amenities!),
                        if ((property.features == null ||
                                property.features!.isEmpty) &&
                            (property.amenities == null ||
                                property.amenities!.isEmpty))
                          const Center(
                              child:
                                  Text('No features or amenities available')),
                      ],
                    ),
                    // Location Tab
                    ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        if (property.address != null)
                          _buildDetailRow('Address', property.address!),
                        if (property.city != null)
                          _buildDetailRow('City', property.city!),
                        if (property.state != null)
                          _buildDetailRow('State', property.state!),
                        if (property.country != null)
                          _buildDetailRow('Country', property.country!),
                        if (property.zipCode != null)
                          _buildDetailRow('ZIP Code', property.zipCode!),
                        if (property.coordinates != null)
                          _buildDetailRow(
                            'Coordinates',
                            '${property.coordinates!.lat}, ${property.coordinates!.lng}',
                          ),
                        if (property.address == null &&
                            property.city == null &&
                            property.state == null &&
                            property.country == null &&
                            property.zipCode == null &&
                            property.coordinates == null)
                          const Center(
                              child: Text('No location information available')),
                      ],
                    ),
                    // Gallery Tab
                    const Center(
                        child: Text(
                            'Gallery View (Implement with GridView of Images)')),
                  ]),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: ${err.toString()}')),
      ),
    );
  }
}
