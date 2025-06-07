import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/models/property.dart'; // Adjust path
import 'package:mobile/providers/property_provider.dart';
import 'package:mobile/widgets/property/property_form_fields.dart'; // Adjust path
// Import your USER-FACING property provider for create/update mutations
// import 'package:mobile/providers/property_provider.dart';

class PropertyFormScreen extends ConsumerStatefulWidget {
  final Property? property; // Pass property for editing, null for creating

  const PropertyFormScreen({super.key, this.property});

  @override
  ConsumerState<PropertyFormScreen> createState() => _PropertyFormScreenState();
}

class _PropertyFormScreenState extends ConsumerState<PropertyFormScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  void _handleSave(Map<String, dynamic> formData) async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      try {
        final propertyService = ref.read(propertyServiceProvider);
        if (widget.property == null) {
          // Create new property using backend API
          await propertyService.createProperty(formData);
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Property created successfully!')),
          );
        } else {
          // Update existing property using backend API
          await propertyService.updateProperty(
            widget.property!.id,
            formData,
          );
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Property updated successfully!')),
          );
        }
        if (mounted) Navigator.of(context).pop();
      } catch (e) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save property: $e')),
        );
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.property == null ? 'Add Property' : 'Edit Property'),
        actions: [
          if (_isLoading)
            const Padding(
                padding: EdgeInsets.all(16.0),
                child: CircularProgressIndicator(color: Colors.white)),
          if (!_isLoading)
            IconButton(
              icon: const Icon(Icons.save),
              onPressed: () => (_formKey.currentState?.validate() ?? false)
                  ? _formKey.currentState!.save()
                  : null, // This will trigger onSave in PropertyFormFields
            ),
        ],
      ),
      body: PropertyFormFields(
        formKey: _formKey,
        initialData: widget.property,
        onSave: _handleSave, // Pass the handler
      ),
    );
  }
}
