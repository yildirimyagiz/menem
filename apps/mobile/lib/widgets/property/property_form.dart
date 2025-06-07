import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/models/property.dart';

// Import your enums if they are separate, e.g., PropertyType, PropertyStatus from your models
// import 'package:your_app_name/models/enums.dart';

// Assuming your Property model has these enums defined or you import them
// For simplicity, I'll use the string values directly as in your Next.js example,
// but ideally, these would come from your generated models/enums.

const List<String> propertyFeaturesList = [
  "POOL",
  "GYM",
  "GARDEN",
  "PARKING",
  "SECURITY",
  "ELEVATOR",
  "STORAGE",
  "BALCONY",
  "TERRACE",
  "FURNISHED",
];
const List<String> propertyAmenitiesList = [
  "WIFI",
  "AIR_CONDITIONING",
  "HEATING",
  "WASHER",
  "DRYER",
  "DISHWASHER",
  "TV",
  "MICROWAVE",
];

class AdminPropertyForm extends ConsumerStatefulWidget {
  final GlobalKey<FormState> formKey;
  final Property? initialProperty; // Null for create, populated for edit
  final Function(Map<String, dynamic> formData) onSubmit;
  final bool isLoading;

  const AdminPropertyForm({
    super.key,
    required this.formKey,
    this.initialProperty,
    required this.onSubmit,
    this.isLoading = false,
  });

  @override
  ConsumerState<AdminPropertyForm> createState() => _AdminPropertyFormState();
}

class _AdminPropertyFormState extends ConsumerState<AdminPropertyForm> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _addressController;
  late TextEditingController _cityController;
  late TextEditingController _stateController;
  late TextEditingController _postalCodeController;
  late TextEditingController _countryController;
  late TextEditingController _yearBuiltController;
  late TextEditingController _sizeController;
  late TextEditingController _bedroomsController;
  late TextEditingController _bathroomsController;
  late TextEditingController _priceController; // Corresponds to marketValue
  late TextEditingController
      _rentalPriceController; // Assuming you'll add this to your Property model if needed
  late TextEditingController _contactNameController;
  late TextEditingController _contactEmailController;
  late TextEditingController _contactPhoneController;
  // Add controllers for all other fields: city, state, postalCode, country, yearBuilt, size, bedrooms, bathrooms, price, contactName, etc.

  PropertyType? _selectedPropertyType;
  PropertyStatus? _selectedPropertyStatus;
  PropertyCategory? _selectedPropertyCategory;
  BuildingClass? _selectedBuildingClass;
  PropertyCondition _selectedCondition = PropertyCondition.good;
  ContactMethod? _selectedContactMethod;

  List<String> _selectedFeatures = [];
  List<String> _selectedAmenities = [];

  @override
  void initState() {
    super.initState();
    _titleController =
        TextEditingController(text: widget.initialProperty?.title ?? '');
    _descriptionController =
        TextEditingController(text: widget.initialProperty?.description ?? '');
    _addressController =
        TextEditingController(text: widget.initialProperty?.address ?? '');
    _cityController =
        TextEditingController(text: widget.initialProperty?.city ?? '');
    _stateController =
        TextEditingController(text: widget.initialProperty?.state ?? '');
    _postalCodeController =
        TextEditingController(text: widget.initialProperty?.zipCode ?? '');
    _countryController =
        TextEditingController(text: widget.initialProperty?.country ?? '');
    _yearBuiltController = TextEditingController(
        text: widget.initialProperty?.yearBuilt?.toString() ?? '');
    _sizeController = TextEditingController(
        text: widget.initialProperty?.size?.toString() ?? '');
    _bedroomsController = TextEditingController(
        text: widget.initialProperty?.bedrooms?.toString() ?? '');
    _bathroomsController = TextEditingController(
        text: widget.initialProperty?.bathrooms?.toString() ?? '');
    _priceController = TextEditingController(
        text: widget.initialProperty?.marketValue?.toString() ?? '');
    _rentalPriceController = TextEditingController(
        text:
            "" /* widget.initialProperty?.rentalPrice?.toString() ?? '' */); // Assuming rentalPrice field might be added
    _contactNameController = TextEditingController(
        text: widget.initialProperty?.contactMethod?.name ??
            widget.initialProperty?.owner?.name ??
            '');
    _contactEmailController = TextEditingController(
        text: widget.initialProperty?.contactEmail ??
            widget.initialProperty?.owner?.email ??
            '');
    _contactPhoneController = TextEditingController(
        text: widget.initialProperty?.contactPhone ??
            widget.initialProperty?.owner?.phone ??
            '');

    _selectedPropertyType = widget.initialProperty?.propertyType;
    _selectedPropertyStatus = widget.initialProperty?.propertyStatus;
    _selectedPropertyCategory = widget.initialProperty?.category;
    _selectedBuildingClass = widget.initialProperty?.buildingClass;
    _selectedCondition = widget.initialProperty?.condition ??
        PropertyCondition.good; // Corrected enum
    _selectedContactMethod = widget.initialProperty?.contactMethod;

    // Assuming features and amenities are List<String> in your Property model
    // and match the enum names.
    _selectedFeatures = List<String>.from(
        widget.initialProperty?.features?.map((f) => f.name) ?? []);
    _selectedAmenities = List<String>.from(
        widget.initialProperty?.amenities?.map((a) => a.name) ?? []);
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _postalCodeController.dispose();
    _countryController.dispose();
    _yearBuiltController.dispose();
    _sizeController.dispose();
    _bedroomsController.dispose();
    _bathroomsController.dispose();
    _priceController.dispose();
    _rentalPriceController.dispose();
    _contactNameController.dispose();
    _contactEmailController.dispose();
    _contactPhoneController.dispose();
    // Dispose other controllers
    super.dispose();
  }

  void _handleFormSubmit() {
    if (widget.formKey.currentState!.validate()) {
      widget.formKey.currentState!.save();
      final formData = {
        'title': _titleController.text,
        'description': _descriptionController.text,
        'address': _addressController.text,
        'city': _cityController.text.isNotEmpty ? _cityController.text : null,
        'state':
            _stateController.text.isNotEmpty ? _stateController.text : null,
        'postalCode': _postalCodeController.text.isNotEmpty
            ? _postalCodeController.text
            : null,
        'country':
            _countryController.text.isNotEmpty ? _countryController.text : null,
        'propertyType': _selectedPropertyType?.name, // Send enum name as string
        'propertyStatus': _selectedPropertyStatus?.name,
        'category': _selectedPropertyCategory?.name,
        'buildingClass': _selectedBuildingClass?.name,
        'condition': _selectedCondition.name,
        'yearBuilt': int.tryParse(_yearBuiltController.text),
        'size': double.tryParse(_sizeController.text),
        'bedrooms': int.tryParse(_bedroomsController.text),
        'bathrooms': int.tryParse(
            _bathroomsController.text), // Assuming bathrooms is Int in Prisma
        'price': double.tryParse(_priceController.text), // for marketValue
        'rentalPrice': double.tryParse(_rentalPriceController.text),
        'features': _selectedFeatures,
        'amenities': _selectedAmenities,
        'contactName': _contactNameController.text.isNotEmpty
            ? _contactNameController.text
            : null,
        'contactEmail': _contactEmailController.text.isNotEmpty
            ? _contactEmailController.text
            : null,
        'contactPhone': _contactPhoneController.text.isNotEmpty
            ? _contactPhoneController.text
            : null,
        'contactMethod': _selectedContactMethod?.name,
        // Add other form data from controllers
      };
      widget.onSubmit(formData);
    }
  }

  Widget _buildTextField(TextEditingController controller, String label,
      {bool isRequired = false,
      TextInputType keyboardType = TextInputType.text,
      int maxLines = 1}) {
    return TextFormField(
      controller: controller,
      decoration:
          InputDecoration(labelText: label, border: const OutlineInputBorder()),
      keyboardType: keyboardType,
      maxLines: maxLines,
      validator: (value) {
        if (isRequired && (value == null || value.isEmpty)) {
          return '$label is required';
        }
        return null;
      },
    );
  }

  Widget _buildDropdown<T extends Enum>(String label, T? currentValue,
      List<T> items, ValueChanged<T?> onChanged) {
    return DropdownButtonFormField<T>(
      decoration:
          InputDecoration(labelText: label, border: const OutlineInputBorder()),
      value: currentValue,
      items: items
          .map((item) => DropdownMenuItem(value: item, child: Text(item.name)))
          .toList(),
      onChanged: onChanged,
    );
  }

  Widget _buildCheckboxGroup(String title, List<String> allItems,
      List<String> selectedItems, Function(String, bool) onToggle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8.0,
          runSpacing: 4.0,
          children: allItems.map((item) {
            final isSelected = selectedItems.contains(item);
            return FilterChip(
              label: Text(item.replaceAll('_', ' ')), // Basic formatting
              selected: isSelected,
              onSelected: (bool selected) {
                onToggle(item, selected);
              },
              selectedColor: Theme.of(context).primaryColorLight,
              checkmarkColor: Theme.of(context).primaryColor,
            );
          }).toList(),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    // For simplicity, using a TabController here. In a real app, you might manage activeTab via Riverpod.
    // This example uses a simple ListView for all fields. You'd structure it with Tabs.
    return Form(
      key: widget.formKey,
      child: ListView(
        padding: const EdgeInsets.all(16.0),
        children: <Widget>[
          // --- Basic Info Tab Fields ---
          _buildTextField(_titleController, 'Title', isRequired: true),
          const SizedBox(height: 16),
          _buildDropdown<PropertyType>(
              'Property Type',
              _selectedPropertyType,
              PropertyType.values,
              (val) => setState(() => _selectedPropertyType = val)),
          const SizedBox(height: 16),
          _buildDropdown<PropertyCategory>(
              'Category',
              _selectedPropertyCategory,
              PropertyCategory.values,
              (val) => setState(() => _selectedPropertyCategory = val)),
          const SizedBox(height: 16),
          _buildTextField(_descriptionController, 'Description', maxLines: 3),
          const SizedBox(height: 16),
          _buildDropdown<PropertyStatus>(
              'Status',
              _selectedPropertyStatus,
              PropertyStatus.values,
              (val) => setState(() => _selectedPropertyStatus = val)),
          const SizedBox(height: 16),
          _buildDropdown<BuildingClass>(
              'Building Class',
              _selectedBuildingClass,
              BuildingClass.values,
              (val) => setState(() => _selectedBuildingClass = val)),
          const SizedBox(height: 16),

          // --- Details Tab Fields ---
          _buildTextField(_addressController, 'Address', isRequired: true),
          // ... Add city, state, postalCode, country, yearBuilt, size, bedrooms, bathrooms, price ...
          const SizedBox(height: 16),
          _buildDropdown<PropertyCondition>(
              'Condition',
              _selectedCondition,
              PropertyCondition.values,
              (val) => setState(() => _selectedCondition = val!)),
          const SizedBox(height: 16),

          // --- Features Tab Fields ---
          _buildCheckboxGroup(
              'Features', propertyFeaturesList, _selectedFeatures,
              (feature, selected) {
            setState(() {
              if (selected) {
                _selectedFeatures.add(feature);
              } else {
                _selectedFeatures.remove(feature);
              }
            });
          }),
          const SizedBox(height: 16),
          _buildCheckboxGroup(
              'Amenities', propertyAmenitiesList, _selectedAmenities,
              (amenity, selected) {
            setState(() {
              if (selected) {
                _selectedAmenities.add(amenity);
              } else {
                _selectedAmenities.remove(amenity);
              }
            });
          }),
          const SizedBox(height: 16),

          // --- Contact Tab Fields (if applicable) ---
          // ... contactName, contactEmail, contactPhone ...

          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: widget.isLoading ? null : _handleFormSubmit,
            child: widget.isLoading
                ? const CircularProgressIndicator(color: Colors.white)
                : const Text('Save Property'),
          ),
        ],
      ),
    );
  }
}
