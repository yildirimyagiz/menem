import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class CityChipList extends StatelessWidget {
  final List<String> cities;
  const CityChipList({super.key, required this.cities});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        itemCount: cities.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, i) => ActionChip(
          label: Text(cities[i]),
          onPressed: () {
            // Handle chip selection here
            if (kDebugMode) {
              print('Selected city: ${cities[i]}');
            }
          },
        ),
      ),
    );
  }
}
