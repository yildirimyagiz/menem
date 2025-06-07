import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/widgets/property/property_form_fields.dart';
// Import your property Riverpod provider for create mutation
// import 'package:mobile/providers/admin_property_providers.dart';
// Import AppLocalizations for translations
// import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class AdminPropertyCreateScreen extends ConsumerStatefulWidget {
  const AdminPropertyCreateScreen({super.key});

  @override
  ConsumerState<AdminPropertyCreateScreen> createState() =>
      _AdminPropertyCreateScreenState();
}

class _AdminPropertyCreateScreenState
    extends ConsumerState<AdminPropertyCreateScreen> {
  final _formKey = GlobalKey<FormState>();

  Future<void> _createProperty(Map<String, dynamic> formData) async {
    try {
      // final propertyNotifier = ref.read(adminPropertyNotifierProvider.notifier);
      // await propertyNotifier.createProperty(formData);

      // Mock success
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Property created successfully (Mock)')),
      );
      Navigator.of(context).pop(true); // Pop with a success flag
    } catch (e) {
      // Handle error, e.g., show a SnackBar
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to create property: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create New Property' /*l10n.createPropertyTitle*/),
      ),
      body: PropertyFormFields(
        formKey: _formKey,
        onSave: _createProperty,
      ),
      // You can add a floating action button for save as well
    );
  }
}
