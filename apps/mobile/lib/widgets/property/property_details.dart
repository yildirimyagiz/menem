import 'package:flutter/material.dart';
import '../../models/property.dart';

class PropertyDetails extends StatelessWidget {
  final Property property;
  final bool showDescription;

  const PropertyDetails({
    super.key,
    required this.property,
    this.showDescription = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          property.title,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        if (showDescription && property.description != null)
          Padding(
            padding: const EdgeInsets.only(top: 4.0),
            child: Text(
              property.description!,
              style: Theme.of(context).textTheme.bodyMedium,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        Wrap(
          spacing: 12,
          children: [
            Chip(label: Text(property.propertyType.name)),
            Chip(label: Text(property.propertyStatus.name)),
            if (property.city != null) Chip(label: Text(property.city!)),
            // Consider country if relevant for summary
            // if (property.country != null) Chip(label: Text(property.country!)),
            if (property.size != null && property.size! > 0)
              Chip(
                  label: Text(
                      '${property.size!.toStringAsFixed(0)} m²')) // Format size
            else
              const Chip(label: Text('Size N/A')),
          ],
        ),
        Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Text(
            property.marketValue != null
                ? 'Price: ${property.marketValue} ${property.currencyId ?? ''}'
                : 'Price: N/A',
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
      ],
    );
  }
}
