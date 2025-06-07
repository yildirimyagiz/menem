import 'package:flutter/material.dart';
import '../../models/property.dart';

class LocationRender extends StatelessWidget {
  final Property property;
  const LocationRender({super.key, required this.property});

  @override
  Widget build(BuildContext context) {
    final address = property.address ?? '';
    final city = property.city ?? '';
    final country = property.country ?? '';
    return Row(
      children: [
        const Icon(Icons.location_on, size: 18, color: Colors.redAccent),
        const SizedBox(width: 4),
        Flexible(
          child: Text(
            [address, city, country].where((e) => e.isNotEmpty).join(', '),
            style: Theme.of(context).textTheme.bodySmall,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
