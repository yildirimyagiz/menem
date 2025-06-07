import 'package:flutter/material.dart';
import 'package:mobile/models/property.dart'; // Adjust path to your actual Property model

class PropertyFormFields extends StatefulWidget {
  final GlobalKey<FormState> formKey;
  final Property? initialData; // For editing
  final Function(Map<String, dynamic> formData) onSave;

  const PropertyFormFields({
    super.key,
    required this.formKey,
    this.initialData,
    required this.onSave,
  });

  @override
  State<PropertyFormFields> createState() => _PropertyFormFieldsState();
}

class _PropertyFormFieldsState extends State<PropertyFormFields> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _sizeController;
  // Add controllers for other fields: bedrooms, bathrooms, price, etc.
  PropertyType _selectedPropertyType = PropertyType.residential; // Default
  PropertyStatus _selectedPropertyStatus = PropertyStatus.available; // Default

  @override
  void initState() {
    super.initState();
    _titleController =
        TextEditingController(text: widget.initialData?.title ?? '');
    _descriptionController =
        TextEditingController(text: widget.initialData?.description ?? '');
    _sizeController =
        TextEditingController(text: widget.initialData?.size.toString() ?? '');
    _selectedPropertyType =
        widget.initialData?.propertyType ?? PropertyType.residential;
    _selectedPropertyStatus =
        widget.initialData?.propertyStatus ?? PropertyStatus.available;
    // Initialize other controllers and fields
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _sizeController.dispose();
    // Dispose other controllers
    super.dispose();
  }

  // ignore: unused_element
  void _submit() {
    if (widget.formKey.currentState!.validate()) {
      widget.formKey.currentState!.save(); // Triggers onSaved for each field
      final formData = {
        'title': _titleController.text,
        'description': _descriptionController.text,
        'size': double.tryParse(_sizeController.text) ?? 0.0,
        'propertyType': _selectedPropertyType.name, // Send enum name as string
        'propertyStatus': _selectedPropertyStatus.name,
        // Add other form data
      };
      widget.onSave(formData);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: widget.formKey,
      child: ListView(
        // Use ListView for scrollability if form is long
        padding: const EdgeInsets.all(16.0),
        children: <Widget>[
          TextFormField(
            controller: _titleController,
            decoration: const InputDecoration(labelText: 'Title'),
            validator: (value) =>
                value!.isEmpty ? 'Title cannot be empty' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _descriptionController,
            decoration: const InputDecoration(labelText: 'Description'),
            maxLines: 3,
            validator: (value) =>
                value!.isEmpty ? 'Description cannot be empty' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _sizeController,
            decoration: const InputDecoration(labelText: 'Size (sqm)'),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value!.isEmpty) return 'Size cannot be empty';
              if (double.tryParse(value) == null) return 'Invalid number';
              return null;
            },
          ),
          const SizedBox(height: 16),
          // Add Dropdowns for Enums like PropertyType, PropertyStatus
          // Example for PropertyType:
          DropdownButtonFormField<PropertyType>(
            value: _selectedPropertyType,
            decoration: const InputDecoration(labelText: 'Property Type'),
            items: PropertyType.values
                .map((type) =>
                    DropdownMenuItem(value: type, child: Text(type.name)))
                .toList(),
            onChanged: (value) =>
                setState(() => _selectedPropertyType = value!),
          ),
          // ... Add other fields for location, bedrooms, bathrooms, price, features, amenities etc.
          // Consider using your existing property section widgets if they can be adapted for input.
          const SizedBox(height: 24),
          // The submit button will likely be in the parent PropertyFormScreen
        ],
      ),
    );
  }
}
