import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/models/property.dart';
import 'package:mobile/widgets/property/edit_property.dart';

// Import your property Riverpod provider for byId query and delete mutation
// import 'package:mobile/providers/admin_property_providers.dart';

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

  Widget _buildDetailRow(String label, Object? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 120,
              child: Text(label,
                  style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value?.toString() ?? 'N/A')),
        ],
      ),
    );
  }

  Widget _buildChipList(String title, List<Object>? items) {
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
    // Replace with your actual provider
    // final propertyAsyncValue = ref.watch(adminPropertyByIdProvider(propertyId));
    final AsyncValue<Property?> propertyAsyncValue = AsyncData(propertyId == "1"
        ? Property.fromJson({
            'id': '1',
            'propertyNumber': 'PROP-001',
            'title': 'Sample Property Detail',
            'description': 'A very nice house with many features.',
            'propertyType': 'residential',
            'propertyStatus': 'available',
            'category': 'apartment',
            'size': 150.0,
            'favoriteCount': 0,
            'listingType': 'sale',
            'events': [],
            'includedServiceId': null,
            'extraChargeId': null,
            'currencyId': null,
            'guestId': null,
            'condition': 'good',
            'address': '123 Main St',
            'city': 'Anytown',
            'state': 'CA',
            'country': 'USA',
            'zipCode': '12345',
            'features': ['pool', 'balcony'],
            'amenities': ['gym'],
            'price': null,
            'propertyCategory': null,
          })
        : null);

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
              if (!context.mounted) return;
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
                // await ref.read(adminPropertyNotifierProvider.notifier).deleteProperty(propertyId);
                // ignore: use_build_context_synchronously
                ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Property deleted (Mock)')));
                if (context.mounted) Navigator.of(context).pop();
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
                    ListView(padding: const EdgeInsets.all(16), children: [
                      _buildDetailRow('Title', property.title),
                      _buildDetailRow('Description', property.description),
                      _buildDetailRow(
                          'Type', _formatEnumValue(property.propertyType.name)),
                      _buildDetailRow('Status',
                          _formatEnumValue(property.propertyStatus.name)),
                      _buildDetailRow(
                          'Category', _formatEnumValue(property.category.name)),
                      // ... Add more fields for basic info, physical characteristics, contact, related entities, metadata
                    ]),
                    // Features Tab
                    ListView(padding: const EdgeInsets.all(16), children: [
                      _buildChipList('Features', property.features),
                      _buildChipList('Amenities', property.amenities),
                    ]),
                    // Location Tab
                    ListView(padding: const EdgeInsets.all(16), children: [
                      _buildDetailRow('Address', property.address),
                      _buildDetailRow('City', property.city),
                      _buildDetailRow('State', property.state),
                      _buildDetailRow('Country', property.country),
                      _buildDetailRow('ZIP Code', property.zipCode),
                      // ... coordinates etc.
                    ]),
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
