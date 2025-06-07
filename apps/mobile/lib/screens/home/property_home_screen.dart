import 'package:flutter/material.dart';
import 'package:mobile/models/property.dart';
import 'package:mobile/widgets/property/property_card.dart';
import 'package:mobile/widgets/property/property_horizontal_list.dart';
import 'package:mobile/widgets/property/city_chip_list.dart';

class PropertyHomeScreen extends StatelessWidget {
  final List<Property> featuredProperties;
  final List<Property> priceReduced;
  final List<Property> urgentSales;
  final Property? listingOfTheMonth;
  final List<String> cities;

  const PropertyHomeScreen({
    super.key,
    required this.featuredProperties,
    required this.priceReduced,
    required this.urgentSales,
    required this.listingOfTheMonth,
    required this.cities,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Discover Properties')),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CityChipList(cities: cities),
            if (listingOfTheMonth != null) ...[
              const SectionTitle(title: 'Listing of the Month'),
              PropertyCard(property: listingOfTheMonth!),
            ],
            const SectionTitle(title: 'Featured Properties'),
            PropertyHorizontalList(properties: featuredProperties),
            const SectionTitle(title: 'Price Reduced'),
            PropertyHorizontalList(properties: priceReduced),
            const SectionTitle(title: 'Urgent Sales'),
            PropertyHorizontalList(properties: urgentSales),
          ],
        ),
      ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  final String title;
  const SectionTitle({super.key, required this.title});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    child: Text(title, style: Theme.of(context).textTheme.titleLarge),
  );
}
