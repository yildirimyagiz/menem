import 'package:flutter/material.dart';
import '../../models/property.dart';

class PropertyCard extends StatelessWidget {
  final Property property;
  final VoidCallback? onTap;
  const PropertyCard({super.key, required this.property, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: property.photos != null && property.photos!.isNotEmpty
            ? ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  property.photos!.first.url,
                  width: 56,
                  height: 56,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) =>
                      const Icon(Icons.home),
                ),
              )
            : const Icon(Icons.home),
        title: Text(property.title,
            style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
                '${property.propertyType.toString().split('.').last} • ${property.propertyStatus.toString().split('.').last}'),
            Text(
                '${property.city ?? ''}${property.city != null && property.country != null ? ', ' : ''}${property.country ?? ''}'),
            Text(
                'Price: ${property.marketValue != null ? '\$${property.marketValue!.toStringAsFixed(2)}' : 'N/A'}'),
            Text(
                'Size: ${property.size != null ? '${property.size} m²' : 'N/A'}'),
            Text(
                'Beds: ${property.bedrooms ?? '-'}  Baths: ${property.bathrooms ?? '-'}'),
          ],
        ),
        trailing: property.isFavorite
            ? const Icon(Icons.favorite, color: Colors.red)
            : null,
      ),
    );
  }
}
