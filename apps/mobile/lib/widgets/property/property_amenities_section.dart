import 'package:flutter/material.dart';
import '../../models/property.dart';
import 'package:mobile/generated/l10n.dart';

class PropertyAmenitiesSection extends StatelessWidget {
  final Property property;

  const PropertyAmenitiesSection({
    super.key,
    required this.property,
  });

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    // Use the list of amenities typed as PropertyAmenities enum
    final allAmenities = property.amenities ?? [];

    if (allAmenities.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          s.amenitiesSectionTitle,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        Wrap(
          // Use Wrap for flexible layout of chips
          spacing: 8,
          runSpacing: 8,
          children: allAmenities.map((amenity) {
            // amenity is already PropertyAmenities
            final iconAndLabel = _getAmenityIconAndLabel(amenity, context);
            return _buildAmenityChip(
              context,
              iconAndLabel.$1,
              iconAndLabel.$2,
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildAmenityChip(
    BuildContext context,
    IconData icon,
    String label,
  ) {
    return Chip(
      avatar: Icon(
        icon,
        size: 16,
        color: Theme.of(context).colorScheme.primary,
      ),
      label: Text(
        label,
        style: Theme.of(context).textTheme.bodyMedium,
      ),
      backgroundColor: Theme.of(context).colorScheme.primaryContainer,
    );
  }

  (IconData, String) _getAmenityIconAndLabel(
      PropertyAmenities amenity, BuildContext context) {
    switch (amenity) {
      // Aligning with common amenities from Zod schema
      // Ensure your Dart PropertyAmenities enum reflects these values
      case PropertyAmenities.wifi: // Assuming WIFI exists in your Dart enum
        return (Icons.wifi, 'WiFi');
      case PropertyAmenities
            .airConditioning: // Assuming AIR_CONDITIONING exists
        return (Icons.ac_unit, 'Air Conditioning');
      case PropertyAmenities.heating: // Assuming HEATING exists
        return (Icons.thermostat, 'Heating');
      case PropertyAmenities.laundry: // Assuming WASHER exists
        return (Icons.local_laundry_service, 'Washer');
      case PropertyAmenities.swimmingPool: // Assuming DRYER exists
        return (
          Icons.dry_cleaning,
          'Swimming Pool'
        ); // Or a more specific icon for dryer
      case PropertyAmenities.tennisCourt: // Assuming DISHWASHER exists
        return (Icons.sports_tennis, 'Tennis Court');
      case PropertyAmenities.conferenceRoom: // Assuming TV exists
        return (Icons.meeting_room, 'Conference Room');
      case PropertyAmenities.security: // Assuming MICROWAVE exists
        return (Icons.security, 'Security');

      // If your Dart enum includes other values like PET_FRIENDLY, GYM, etc.,
      // and they are intended to be part of the PropertyAmenities, keep/add their cases here.
      // For example:
      // case PropertyAmenities.PET_FRIENDLY:
      //   return (Icons.pets, 'Pet Friendly');
      // case PropertyAmenities.GYM:
      //   return (Icons.fitness_center, 'Gym');

      default: // Handle any other enum values not explicitly mapped
        return (Icons.category, amenity.name); // Use the enum name as label
    }
  }
}
