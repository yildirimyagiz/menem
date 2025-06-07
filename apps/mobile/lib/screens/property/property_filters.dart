import 'package:flutter/material.dart';
import '../../enums/property_enums.dart';

class PropertyFilters extends StatefulWidget {
  final void Function({
    String? title,
    PropertyType? propertyType,
    PropertyStatus? propertyStatus,
    PropertyCategory? category,
    String? city,
    String? country,
    double? minPrice,
    double? maxPrice,
    int? minBedrooms,
    int? maxBedrooms,
    int? minBathrooms,
    int? maxBathrooms,
    double? minSize,
    double? maxSize,
    List<PropertyAmenities>? amenities,
    List<PropertyFeatures>? features,
  }) onChanged;
  const PropertyFilters({super.key, required this.onChanged});

  @override
  State<PropertyFilters> createState() => _PropertyFiltersState();
}

class _PropertyFiltersState extends State<PropertyFilters> {
  final _titleController = TextEditingController();
  final _cityController = TextEditingController();
  final _countryController = TextEditingController();
  final _minPriceController = TextEditingController();
  final _maxPriceController = TextEditingController();
  final _minBedroomsController = TextEditingController();
  final _maxBedroomsController = TextEditingController();
  final _minBathroomsController = TextEditingController();
  final _maxBathroomsController = TextEditingController();
  final _minSizeController = TextEditingController();
  final _maxSizeController = TextEditingController();

  PropertyType? _selectedType;
  PropertyStatus? _selectedStatus;
  PropertyCategory? _selectedCategory;
  final Set<PropertyAmenities> _selectedAmenities = {};
  final Set<PropertyFeatures> _selectedFeatures = {};

  @override
  void dispose() {
    _titleController.dispose();
    _cityController.dispose();
    _countryController.dispose();
    _minPriceController.dispose();
    _maxPriceController.dispose();
    _minBedroomsController.dispose();
    _maxBedroomsController.dispose();
    _minBathroomsController.dispose();
    _maxBathroomsController.dispose();
    _minSizeController.dispose();
    _maxSizeController.dispose();
    super.dispose();
  }

  void _onFilterChanged() {
    widget.onChanged(
      title: _titleController.text.isEmpty ? null : _titleController.text,
      propertyType: _selectedType,
      propertyStatus: _selectedStatus,
      category: _selectedCategory,
      city: _cityController.text.isEmpty ? null : _cityController.text,
      country: _countryController.text.isEmpty ? null : _countryController.text,
      minPrice: _minPriceController.text.isEmpty ? null : double.tryParse(_minPriceController.text),
      maxPrice: _maxPriceController.text.isEmpty ? null : double.tryParse(_maxPriceController.text),
      minBedrooms: _minBedroomsController.text.isEmpty ? null : int.tryParse(_minBedroomsController.text),
      maxBedrooms: _maxBedroomsController.text.isEmpty ? null : int.tryParse(_maxBedroomsController.text),
      minBathrooms: _minBathroomsController.text.isEmpty ? null : int.tryParse(_minBathroomsController.text),
      maxBathrooms: _maxBathroomsController.text.isEmpty ? null : int.tryParse(_maxBathroomsController.text),
      minSize: _minSizeController.text.isEmpty ? null : double.tryParse(_minSizeController.text),
      maxSize: _maxSizeController.text.isEmpty ? null : double.tryParse(_maxSizeController.text),
      amenities: _selectedAmenities.isEmpty ? null : _selectedAmenities.toList(),
      features: _selectedFeatures.isEmpty ? null : _selectedFeatures.toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _titleController,
          decoration: const InputDecoration(labelText: 'Title'),
          onChanged: (_) => _onFilterChanged(),
        ),
        DropdownButtonFormField<PropertyType>(
          value: _selectedType,
          decoration: const InputDecoration(labelText: 'Type'),
          items: PropertyType.values
              .map((type) => DropdownMenuItem(
                    value: type,
                    child: Text(type.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (type) {
            setState(() => _selectedType = type);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<PropertyStatus>(
          value: _selectedStatus,
          decoration: const InputDecoration(labelText: 'Status'),
          items: PropertyStatus.values
              .map((status) => DropdownMenuItem(
                    value: status,
                    child: Text(status.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (status) {
            setState(() => _selectedStatus = status);
            _onFilterChanged();
          },
        ),
        DropdownButtonFormField<PropertyCategory>(
          value: _selectedCategory,
          decoration: const InputDecoration(labelText: 'Category'),
          items: PropertyCategory.values
              .map((cat) => DropdownMenuItem(
                    value: cat,
                    child: Text(cat.toString().split('.').last),
                  ))
              .toList(),
          onChanged: (cat) {
            setState(() => _selectedCategory = cat);
            _onFilterChanged();
          },
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _minPriceController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Min Price'),
                onChanged: (_) => _onFilterChanged(),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: _maxPriceController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Max Price'),
                onChanged: (_) => _onFilterChanged(),
              ),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _minBedroomsController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Min Bedrooms'),
                onChanged: (_) => _onFilterChanged(),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: _maxBedroomsController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Max Bedrooms'),
                onChanged: (_) => _onFilterChanged(),
              ),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _minBathroomsController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Min Bathrooms'),
                onChanged: (_) => _onFilterChanged(),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: _maxBathroomsController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Max Bathrooms'),
                onChanged: (_) => _onFilterChanged(),
              ),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _minSizeController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Min Size (m²)'),
                onChanged: (_) => _onFilterChanged(),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: _maxSizeController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Max Size (m²)'),
                onChanged: (_) => _onFilterChanged(),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: PropertyAmenities.values.map((amenity) {
            return FilterChip(
              label: Text(amenity.toString().split('.').last),
              selected: _selectedAmenities.contains(amenity),
              onSelected: (selected) {
                setState(() {
                  if (selected) {
                    _selectedAmenities.add(amenity);
                  } else {
                    _selectedAmenities.remove(amenity);
                  }
                  _onFilterChanged();
                });
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: PropertyFeatures.values.map((feature) {
            return FilterChip(
              label: Text(feature.toString().split('.').last),
              selected: _selectedFeatures.contains(feature),
              onSelected: (selected) {
                setState(() {
                  if (selected) {
                    _selectedFeatures.add(feature);
                  } else {
                    _selectedFeatures.remove(feature);
                  }
                  _onFilterChanged();
                });
              },
            );
          }).toList(),
        ),
        TextField(
          controller: _cityController,
          decoration: const InputDecoration(labelText: 'City'),
          onChanged: (_) => _onFilterChanged(),
        ),
        TextField(
          controller: _countryController,
          decoration: const InputDecoration(labelText: 'Country'),
          onChanged: (_) => _onFilterChanged(),
        ),
      ],
    );
  }
}
