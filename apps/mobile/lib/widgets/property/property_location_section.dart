import 'package:flutter/material.dart';

import 'package:mobile/models/property.dart' show Property;
import 'package:mobile/models/coordinates.dart'; // Import Coordinates directly
import 'package:url_launcher/url_launcher.dart';
import 'package:mobile/generated/l10n.dart';

// Consider adding a dependency on `geolocator` or similar if you need to check location permissions before launching maps.
class PropertyLocationSection extends StatelessWidget {
  final Property property;

  const PropertyLocationSection({
    super.key,
    required this.property,
  });

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    final hasAddress = property.address != null && property.address!.isNotEmpty;
    final hasCity = property.city != null && property.city!.isNotEmpty;
    final hasState = property.state != null && property.state!.isNotEmpty;
    final hasCountry = property.country != null && property.country!.isNotEmpty;
    final hasCoordinates = property.coordinates != null;
    if (!hasAddress &&
        !hasCity &&
        !hasState &&
        !hasCountry &&
        !hasCoordinates) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          s.locationSectionTitle,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        _buildLocationInfo(context, Icons.location_on, property.address ?? ''),
        const SizedBox(height: 8),
        _buildLocationInfo(
          context,
          Icons.pin_drop,
          property.coordinates != null
              ? '${property.coordinates!.lat}, ${property.coordinates!.lng}'
              : '',
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => _openMaps(property.coordinates),
            icon: const Icon(Icons.directions),
            label: Text(s.getDirectionsButton),
          ),
        ),
      ],
    );
  }

  Widget _buildLocationInfo(
    BuildContext context,
    IconData icon,
    String text,
  ) {
    return Row(
      children: [
        Icon(
          icon,
          size: 20,
          color: Theme.of(context).colorScheme.primary,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
        ),
      ],
    );
  }

  Future<void> _openMaps(Coordinates? coordinates) async {
    if (coordinates == null) return;
    final url = Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}',
    );
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }
}
