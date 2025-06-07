import 'package:flutter/material.dart';

import '../../l10n/l10n.dart';
import '../../models/property.dart'; // Contains PropertyAmenities enum
// Import S class

class AmenitiesRender extends StatelessWidget {
  final List<PropertyAmenities> amenities; // Use the correct enum type
  const AmenitiesRender({super.key, required this.amenities});

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    if (amenities.isEmpty) {
      return Text(s.noAmenitiesListed);
    }
    // PropertyAmenities is an enum, use the .name property
    // .name is non-nullable for enums in recent Dart versions
    return Wrap(
      spacing: 8,
      children:
          amenities.map((amenity) => Chip(label: Text(amenity.name))).toList(),
    );
  }
}
