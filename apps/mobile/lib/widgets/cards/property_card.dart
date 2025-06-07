import 'package:flutter/material.dart';
import '../../models/property.dart';
import 'package:intl/intl.dart';

class PropertyCard extends StatelessWidget {
  final Property property;
  final VoidCallback? onTap;

  const PropertyCard({
    super.key,
    required this.property,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Consider using property.price if it's more relevant than marketValue,
    // Also, consider making currency dynamic based on property.currencyId or a global setting.
    final priceString = NumberFormat.simpleCurrency(name: 'USD')
        .format(property.marketValue ?? property.price ?? 0.0);
    final amenities = property.amenities ?? [];

    // Fragile: Heuristic for pet-friendly.
    // Prefer a dedicated model field (e.g., property.petsAllowed) or enum value (e.g., PropertyAmenities.PET_FRIENDLY).
    // e.g., property.petsAllowed (boolean) or amenities.contains(PropertyAmenities.PET_FRIENDLY)
    // Based on Zod schema, this isn't a standard amenity/feature.
    // If it's a boolean field on the Property model, use that.
    // If it's a specific enum value in your Dart PropertyAmenities/Features, check for that.
    // The current string matching is a fallback but unreliable.
    // Assuming for now it's a heuristic based on amenity names.
    final isPetFriendly = amenities.any((amenity) =>
        amenity.name.toLowerCase().contains('pet') ||
        amenity.name.toLowerCase().contains('animal'));

    // Prefer checking structured data like greenCertification.
    // The string match on amenity/feature names is a fallback.
    final isEcoFriendly = property.greenCertification != null ||
        // Fallback heuristic: check features for 'garden' or 'eco'
        (property.features?.any((f) =>
                f.name.toLowerCase().contains('garden') ||
                f.name.toLowerCase().contains('eco')) ??
            false);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (property.photos?.isNotEmpty ?? false)
              AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                  property.photos!.first.url,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      color: Colors.grey[300],
                      child: const Icon(
                        Icons.image_not_supported,
                        size: 48,
                        color: Colors.grey,
                      ),
                    );
                  },
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          property.title,
                          style: Theme.of(context).textTheme.titleLarge,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (property.featured ?? false)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.primary,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'Featured',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  if (property.address != null && property.address!.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        property.address ?? '',
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ),
                  const SizedBox(height: 8),
                  Text(
                    property.description ?? '',
                    style: Theme.of(context).textTheme.bodyMedium,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    runSpacing: 4,
                    children: [
                      _buildInfoChip(
                        context,
                        Icons.bed,
                        '${property.bedrooms ?? 0} Beds',
                      ),
                      _buildInfoChip(
                        context,
                        Icons.bathtub_outlined,
                        '${property.bathrooms ?? 0} Baths',
                      ),
                      _buildInfoChip(
                        context,
                        Icons.square_foot,
                        property.size != null && property.size! > 0
                            ? '${property.size!.toStringAsFixed(0)} m²' // Format size
                            : 'N/A',
                      ),
                      _buildInfoChip(
                        context,
                        Icons.garage,
                        '${property.parkingSpaces ?? 0} Garages', // Display 0 if null
                      ),
                      if (isEcoFriendly)
                        _buildBadge(context, 'Eco-friendly', Colors.green),
                      if (isPetFriendly)
                        _buildBadge(context, 'Pet-friendly', Colors.blue),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        priceString,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Theme.of(context).colorScheme.primary,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      Container(
                        margin: const EdgeInsets.only(left: 8),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: _getStatusColor(property.propertyStatus)
                              .withAlpha(25),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          property.propertyStatus.name, // Using .name for enums
                          style: TextStyle(
                            color: _getStatusColor(property.propertyStatus),
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(BuildContext context, IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(BuildContext context, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withAlpha(25),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Color _getStatusColor(PropertyStatus status) {
    switch (status) {
      case PropertyStatus.available:
        return Colors.green;
      case PropertyStatus.pending:
        return Colors.orange;
      case PropertyStatus.sold:
        return Colors.red;
      case PropertyStatus.rented:
        return Colors.blue;
      case PropertyStatus.offMarket:
        return Colors.grey;
      case PropertyStatus.underContract:
        return Colors.purple;
      case PropertyStatus.pendingApproval:
        return Colors.amber;
      case PropertyStatus.maintenance:
        return Colors.brown;
      case PropertyStatus.foreclosure:
        return Colors.red.shade900;
      case PropertyStatus.draft:
        return Colors.blueGrey;
      case PropertyStatus.inactive:
        return Colors.grey.shade600;
      // Default color for unhandled statuses
    }
  }
}
