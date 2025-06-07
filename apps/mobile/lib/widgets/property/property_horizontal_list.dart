import 'package:flutter/material.dart';
import 'package:mobile/models/property.dart';
import 'property_card.dart';

class PropertyHorizontalList extends StatelessWidget {
  final List<Property> properties;
  const PropertyHorizontalList({super.key, required this.properties});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 260,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: properties.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, i) => SizedBox(
          width: 220,
          child: PropertyCard(property: properties[i]),
        ),
      ),
    );
  }
}
