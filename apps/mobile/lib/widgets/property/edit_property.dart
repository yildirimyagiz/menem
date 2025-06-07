import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:logging/logging.dart';

import 'package:mobile/models/property.dart';
import 'package:mobile/models/property_form.dart';
import 'package:mobile/providers/property_provider.dart';
import 'package:mobile/widgets/property/property_form.dart' as property_form;

final _logger = Logger('AdminPropertyEditScreen');

// Provider to fetch a single property by ID
final propertyDetailProvider =
    FutureProvider.family<Property?, String>((ref, propertyId) async {
  try {
    final repository = ref.read(propertyNotifierProvider.notifier);
    return await repository.getProperty(propertyId);
  } catch (e) {
    _logger.severe('Error fetching property details', e);
    rethrow;
  }
});

class AdminPropertyEditScreen extends ConsumerStatefulWidget {
  final String propertyId;
  const AdminPropertyEditScreen({super.key, required this.propertyId});

  @override
  ConsumerState<AdminPropertyEditScreen> createState() =>
      _AdminPropertyEditScreenState();
}

class _AdminPropertyEditScreenState
    extends ConsumerState<AdminPropertyEditScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isSubmitting = false;

  Future<void> _updateProperty(Map<String, dynamic> formData) async {
    setState(() => _isSubmitting = true);

    try {
      _logger.fine("Updating property with ID: ${widget.propertyId}");

      // Convert form data to PropertyForm
      final propertyForm = PropertyForm(
        formData['size']?.toDouble(),
        formData['favoriteCount'],
        formData['listingType'],
        formData['includedServiceId'],
        formData['extraChargeId'],
        formData['currencyId'],
        formData['guestId'],
        id: widget.propertyId,
        title: formData['title'] ?? '',
        description: formData['description'],
        locationId: formData['locationId'],
        price: formData['price']?.toDouble(),
        yearBuilt: formData['yearBuilt'],
        category: formData['category'] ?? PropertyCategory.apartment,
        status: formData['status'] ?? PropertyStatus.available,
        propertyType: formData['propertyType'] ?? PropertyType.residential,
        condition: formData['condition'],
        features: formData['features'] ?? [],
        amenities: formData['amenities'] ?? [],
        ownerId: formData['ownerId'],
        agencyId: formData['agencyId'],
        buildingClass: formData['buildingClass'],
        listedAt: formData['listedAt'] != null
            ? DateTime.parse(formData['listedAt'])
            : null,
        deletedAt: formData['deletedAt'] != null
            ? DateTime.parse(formData['deletedAt'])
            : null,
      );

      // Update the property using the notifier
      final notifier = ref.read(propertyNotifierProvider.notifier);
      await notifier.updateProperty(propertyForm);

      if (!mounted) return;

      // Show success message and pop back
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Property updated successfully!')),
      );

      // Refresh the property list
      ref.invalidate(propertyNotifierProvider);

      if (mounted) {
        Navigator.of(context).pop(true);
      }
    } catch (e, stackTrace) {
      _logger.severe('Error updating property', e, stackTrace);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update property: ${e.toString()}'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Use the property detail provider to fetch property details
    final propertyAsyncValue =
        ref.watch(propertyDetailProvider(widget.propertyId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Property'),
      ),
      body: propertyAsyncValue.when(
        data: (property) {
          if (property == null) {
            return const Center(child: Text('Property not found.'));
          }
          return property_form.AdminPropertyForm(
            formKey: _formKey,
            initialProperty: property,
            onSubmit: _updateProperty,
            isLoading: _isSubmitting,
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) =>
            Center(child: Text('Error loading property: ${err.toString()}')),
      ),
    );
  }
}
