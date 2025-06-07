import 'package:flutter/material.dart';
import '../../models/property.dart';

class PropertyFeaturesSection extends StatelessWidget {
  final Property property;

  const PropertyFeaturesSection({
    super.key,
    required this.property,
  });

  @override
  Widget build(BuildContext context) {
    if (property.features?.isEmpty ?? true) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Features',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: property.features?.map((feature) {
                final iconAndLabel = _getFeatureIconAndLabel(feature);
                return _buildFeatureChip(
                  context,
                  iconAndLabel.$1,
                  iconAndLabel.$2,
                );
              }).toList() ??
              [],
        ),
      ],
    );
  }

  Widget _buildFeatureChip(
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

  (IconData, String) _getFeatureIconAndLabel(PropertyFeatures feature) {
    switch (feature) {
      case PropertyFeatures.parking:
        return (Icons.local_parking, 'Parking');
      case PropertyFeatures.garden:
        return (Icons.landscape, 'Garden');
      case PropertyFeatures.pool:
        return (Icons.pool, 'Pool');
      case PropertyFeatures.balcony:
        return (Icons.balcony, 'Balcony');
      case PropertyFeatures.terrace:
        return (Icons.deck, 'Terrace');
      case PropertyFeatures.fireplace:
        return (Icons.fireplace, 'Fireplace');
      case PropertyFeatures.securitySystem:
        return (Icons.security, 'Security System');
      case PropertyFeatures.smartHome:
        return (Icons.home, 'Smart Home');
      case PropertyFeatures.elevator:
        return (Icons.elevator, 'Elevator');
      case PropertyFeatures.basement:
        return (Icons.downhill_skiing, 'Basement');
      case PropertyFeatures.attic:
        return (Icons.roofing, 'Attic');
      case PropertyFeatures.garage:
        return (Icons.garage, 'Garage');
      case PropertyFeatures.airConditioning:
        return (Icons.ac_unit, 'Air Conditioning');
      case PropertyFeatures.furnished:
        return (Icons.chair, 'Furnished');
      case PropertyFeatures.petsAllowed:
        return (Icons.ac_unit, 'Air Conditioning'); // Example
    }
  }
}
