import 'package:flutter/material.dart';
import '../../models/property.dart';

class PropertyInfoSection extends StatelessWidget {
  final Property property;

  const PropertyInfoSection({
    super.key,
    required this.property,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          property.title,
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: 8),
        Text(
          property.description ?? '',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            if (property.bedrooms != null)
              _buildInfoChip(
                context,
                Icons.bed,
                '${property.bedrooms} Bedrooms',
              ),
            if (property.bathrooms != null)
              _buildInfoChip(
                context,
                Icons.bathtub,
                '${property.bathrooms} Bathrooms',
              ),
            _buildInfoChip(
              context,
              Icons.square_foot,
              '${property.size} sq ft',
            ),
            if (property.floors != null)
              _buildInfoChip(
                context,
                Icons.layers,
                '${property.floors} Floors',
              ),
            _buildInfoChip(
              context,
              Icons.home,
              property.propertyType.toString().split('.').last,
            ),
            _buildInfoChip(
              context,
              Icons.category,
              property.category.toString().split('.').last,
            ),
            _buildInfoChip(
              context,
              Icons.construction,
              property.condition.toString().split('.').last,
            ),
            if (property.yearBuilt != null)
              _buildInfoChip(
                context,
                Icons.calendar_today,
                'Built in ${property.yearBuilt}',
              ),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoChip(
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
}
