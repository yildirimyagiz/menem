import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/providers/property_provider.dart';
import 'package:mobile/models/property.dart'
    as property_model; // Aliased to avoid conflict
import '../../../../services/navigation_service.dart';
import 'package:mobile/components/layouts/client_layout.dart';
import '../../widgets/property/property_image_carousel.dart';
import '../../widgets/property/property_info_section.dart';
import '../../widgets/property/property_features_section.dart';
import '../../widgets/property/property_amenities_section.dart';
import '../../widgets/property/property_location_section.dart';
import '../../widgets/property/property_contact_section.dart';
import 'package:mobile/components/client/bottom_navbar.dart';
import '../../../../widgets/logical_sized_box.dart';
import 'package:mobile/widgets/commons/loading_state.dart';
import 'package:mobile/widgets/commons/error_state.dart';

// Provider to fetch a single property by ID from backend
final propertyByIdProvider = FutureProvider.autoDispose
    .family<property_model.Property, String>((ref, propertyId) async {
  final propertyService = ref.read(propertyServiceProvider);
  final property = await propertyService.getPropertyById(propertyId);
  if (property == null) {
    throw Exception('Property not found');
  }
  return property;
});

extension on List<property_model.Property> {
  get id => null;
}

class PropertyDetailScreen extends ConsumerWidget {
  final String propertyId;

  const PropertyDetailScreen({
    super.key,
    required this.propertyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncProperty = ref.watch(propertyByIdProvider(propertyId));

    return Scaffold(
      body: ClientLayout(
        child: asyncProperty.when(
          data: (propertyData) => _buildPropertyContent(context, ref, propertyData),
          loading: () => const LoadingState(message: "Loading property details..."),
          error: (err, stack) => ErrorState(
            message: "Failed to load property: ${err.toString()}",
            onRetry: () => ref.refresh(propertyByIdProvider(propertyId)),
          ),
        ),
      ),
      bottomNavigationBar: BottomNavbar(
        currentIndex: 0, // Set to the correct index for this page
        onTap: (index) {
          // TODO: Implement navigation logic for bottom nav
        },
      ),
    );
  }

  // Example: return ref.watch(apiServiceProvider).getPropertyById(propertyId);
  void _showContactDialog(
      BuildContext context, property_model.Property propertyData) {
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
                'Contact Agent',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const LogicalSizedBox(blockSize: 16),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: PropertyContactSection(property: propertyData),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPropertyContent(BuildContext context, WidgetRef ref,
      property_model.Property propertyData) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 300,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            background: PropertyImageCarousel(
              // Assuming propertyData.photos is already List<photo_model.Photo>?
              // If it's List<Map<String, dynamic>>, you'd need:
              // photos: (propertyData.photos?.map((p) => photo_model.Photo.fromJson(p)).toList() ?? const []),
              photos: propertyData.photos ?? const [],
            ),
          ),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => NavigationService.goBack(),
          ),
          actions: [
            Consumer(builder: (context, ref, child) {
              // Example: Watch a specific provider for favorite status if it exists
              // final isFavorite = ref.watch(favoriteStatusProvider(propertyData.id));
              return IconButton(
                icon: Icon(
                  propertyData
                          .isFavorite // Assuming Property model has isFavorite
                      ? Icons.favorite
                      : Icons.favorite_border,
                  color: propertyData.isFavorite ? Colors.red : null,
                ),
                onPressed: () {
                  ref
                      .read(propertyNotifierProvider.notifier)
                      .toggleFavorite(propertyData.id);
                },
              );
            }),
            IconButton(
              icon: const Icon(Icons.share),
              onPressed: () {
                // TODO: Implement share functionality
                // Example: Share.share('Check out this property!');
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Share functionality coming soon!')),
                );
              },
            ),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                PropertyInfoSection(property: propertyData),
                const LogicalSizedBox(blockSize: 24),
                PropertyFeaturesSection(property: propertyData),
                const LogicalSizedBox(blockSize: 24),
                PropertyAmenitiesSection(property: propertyData),
                const LogicalSizedBox(blockSize: 24),
                PropertyLocationSection(property: propertyData),
                const LogicalSizedBox(blockSize: 24),
                // PropertyContactSection is now part of the modal sheet
                // PropertyContactSection(property: propertyData),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomBar(
      BuildContext context, property_model.Property propertyData) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(25), // Updated from withOpacity(0.1)
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Price',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                Text(
                  '\$${propertyData.marketValue?.toStringAsFixed(2) ?? '0.00'}',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () => _showContactDialog(context, propertyData),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(
                horizontal: 32,
                vertical: 16,
              ),
            ),
            child: const Text('Contact Agent'),
          ),
        ],
      ),
    );
  }
}
