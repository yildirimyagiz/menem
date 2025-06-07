import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
// import 'package:flutter_gen/gen_l10n/app_localizations.dart'; // Will be used after l10n setup
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/widgets/property/property_form.dart'; // Corrected import
// Assuming this is your admin property provider
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
  bool _isLoading = false;

  Future<void> _createProperty(Map<String, dynamic> formData) async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Replace with your actual Riverpod provider call
      // Example:
      // await ref.read(adminPropertyActionsProvider.notifier).createProperty(formData);

      // Simulate API call for now, replace with actual call
      if (kDebugMode) {
        print("Form Data to Create: $formData");
      }
      await Future.delayed(
          const Duration(seconds: 2)); // Simulate network delay

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Property created successfully!')));
      Navigator.of(context).pop(true); // Pop with a success flag
    } catch (e) {
      setState(() {});
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // final l10n = AppLocalizations.of(context)!; // Uncomment once l10n is set up
    return Scaffold(
      appBar: AppBar(
        // title: Text(l10n.createPropertyTitle), // Use this once l10n is set up
        title: const Text('Create New Property'), // Placeholder title
      ),
      body: AdminPropertyForm(
        formKey: _formKey,
        onSubmit: _createProperty,
        isLoading: _isLoading,
      ),
      // You can add a floating action button for save as well
    );
  }
}
