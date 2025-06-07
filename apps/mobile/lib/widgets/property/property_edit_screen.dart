import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/models/property.dart';
import 'package:mobile/widgets/property/property_form.dart';
// Import your property Riverpod provider for byId query and update mutation
// import 'package:mobile/providers/admin_property_providers.dart';

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
    setState(() {
      _isSubmitting = true;
    });

    try {
      // final propertyNotifier = ref.read(adminPropertyNotifierProvider.notifier);
      // await propertyNotifier.updateProperty(widget.propertyId, formData);

      // Mock success
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Property updated successfully (Mock)')),
      );
      Navigator.of(context).pop(true);
    } catch (e) {
      setState(() {});
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Replace with your actual provider to fetch property by ID
    // final propertyAsyncValue = ref.watch(adminPropertyByIdProvider(widget.propertyId));
    // Mocking async value for structure
    final AsyncValue<Property?> propertyAsyncValue =
        AsyncData(widget.propertyId == "1"
            ? Property.fromJson({
                'id': '1',
                'propertyNumber': 'PROP-001',
                'title': 'Sample Property for Edit',
                'propertyType': 'residential',
                'propertyStatus': 'available',
                'category': 'apartment',
                'condition': 'good',
                'size': 150.0,
                'favoriteCount': 0,
                'listingType': 'sale',
                'events': <String>[],
                'currencyId': 'USD',
                'description': 'A nice house',
                'address': '123 Main St',
                'city': 'Anytown',
                'state': 'CA',
                'country': 'USA',
                'zipCode': '12345',
                'bedrooms': 3,
                'bathrooms': 2,
                'floors': 2,
                'yearBuilt': 2020,
                'features': <String>['parking', 'garden', 'balcony'],
                'amenities': <String>['gym', 'laundry', 'parking'],
                'locationAmenities': <String>[],
                'facilityAmenities': <String>[],
                'isActive': true,
                'featured': false,
                'createdAt': DateTime.now().toIso8601String(),
                'updatedAt': DateTime.now().toIso8601String(),
              })
            : null);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Property'),
      ),
      body: propertyAsyncValue.when(
        data: (property) {
          if (property == null) {
            return const Center(child: Text('Property not found.'));
          }
          return AdminPropertyForm(
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
