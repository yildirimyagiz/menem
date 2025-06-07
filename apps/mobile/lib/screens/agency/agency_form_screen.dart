import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher_string.dart';

import '../../models/agency.dart';
import '../../providers/agency_provider.dart';
import '../../widgets/commons/image_picker_widget.dart';

class AgencyFormScreen extends ConsumerStatefulWidget {
  final Agency? agency;
  static const routeName = '/agency/form';

  const AgencyFormScreen({
    super.key,
    this.agency,
  });

  @override
  ConsumerState<AgencyFormScreen> createState() => _AgencyFormScreenState();
}

class _AgencyFormScreenState extends ConsumerState<AgencyFormScreen> {
  static const _formPadding = EdgeInsets.all(16.0);
  static const _fieldSpacing = 16.0;
  static const _buttonHeight = 50.0;

  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _websiteController = TextEditingController();
  final _addressController = TextEditingController();

  String? _logoUrl;
  bool _isLoading = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _initializeForm();
  }

  void _initializeForm() {
    if (widget.agency != null) {
      _nameController.text = widget.agency!.name;
      _descriptionController.text = widget.agency!.description ?? '';
      _phoneController.text = widget.agency!.phone ?? '';
      _emailController.text = widget.agency!.email ?? '';
      _websiteController.text = widget.agency!.website ?? '';
      _addressController.text = widget.agency!.address ?? '';
      _logoUrl = widget.agency!.logoUrl;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _websiteController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    if (_isLoading) return;

    setState(() => _isLoading = true);

    try {
      final imagePicker = ImagePicker();
      final pickedFile = await imagePicker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        await _uploadImageToStorage(pickedFile.path);
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('Failed to pick image. Please try again.');
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _uploadImageToStorage(String imagePath) async {
    try {
      // Simulate upload delay
      await Future.delayed(const Duration(seconds: 1));

      // In a real app, you would upload the image to storage here
      // final downloadUrl = await _storageService.uploadImage(pickedFile);

      setState(() {
        _logoUrl = 'https://via.placeholder.com/300';
      });
    } catch (e) {
      if (!mounted) return;
      _showErrorSnackBar('Failed to upload image. Please try again.');
      rethrow;
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate() || _isSubmitting) return;

    setState(() => _isSubmitting = true);

    try {
      final agencyData = {
        'name': _nameController.text.trim(),
        if (_descriptionController.text.isNotEmpty)
          'description': _descriptionController.text.trim(),
        if (_phoneController.text.isNotEmpty)
          'phone': _phoneController.text.trim(),
        if (_emailController.text.isNotEmpty)
          'email': _emailController.text.trim(),
        if (_websiteController.text.isNotEmpty)
          'website': _normalizeUrl(_websiteController.text.trim()),
        if (_addressController.text.isNotEmpty)
          'address': _addressController.text.trim(),
        if (_logoUrl != null) 'logoUrl': _logoUrl,
        'isActive': true,
      };

      if (widget.agency == null) {
        await ref.read(agencyListProvider.notifier).createAgency(agencyData);
      } else {
        await ref
            .read(agencyListProvider.notifier)
            .updateAgency(widget.agency!.id, agencyData);
      }

      if (mounted) {
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar(
          'Failed to ${widget.agency == null ? 'create' : 'update'} agency. Please try again.',
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  String _normalizeUrl(String url) {
    if (url.isEmpty) return url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://$url';
    }
    return url;
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Future<bool> _confirmDelete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Agency'),
        content: const Text('Are you sure you want to delete this agency?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('CANCEL'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(
              foregroundColor: Theme.of(context).colorScheme.error,
            ),
            child: const Text('DELETE'),
          ),
        ],
      ),
    );

    return confirmed ?? false;
  }

  Future<void> _deleteAgency() async {
    if (!mounted || _isSubmitting) return;

    final confirmed = await _confirmDelete();
    if (!confirmed) return;

    setState(() => _isSubmitting = true);

    try {
      await ref
          .read(agencyListProvider.notifier)
          .deleteAgency(widget.agency!.id);

      if (mounted) {
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('Failed to delete agency. Please try again.');
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isEditing = widget.agency != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Agency' : 'Create Agency'),
        actions: [
          if (isEditing)
            IconButton(
              icon: const Icon(Icons.delete_outline),
              onPressed: _isSubmitting ? null : _deleteAgency,
              tooltip: 'Delete Agency',
            ),
        ],
      ),
      body: _buildForm(theme),
    );
  }

  Widget _buildForm(ThemeData theme) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Form(
      key: _formKey,
      child: ListView(
        padding: _formPadding,
        children: [
          _buildImagePicker(),
          const SizedBox(height: _fieldSpacing),
          _buildNameField(theme),
          const SizedBox(height: _fieldSpacing),
          _buildDescriptionField(theme),
          const SizedBox(height: _fieldSpacing * 1.5),
          _buildContactSection(theme),
          const SizedBox(height: _fieldSpacing * 2),
          _buildSubmitButton(theme),
        ],
      ),
    );
  }

  Widget _buildImagePicker() {
    return Center(
      child: Column(
        children: [
          ImagePickerWidget(
            imageUrl: _logoUrl,
            onPickImage: _pickImage,
            isLoading: _isLoading,
          ),
          if (_logoUrl != null)
            TextButton.icon(
              onPressed: _pickImage,
              icon: const Icon(Icons.edit),
              label: const Text('Change Logo'),
            ),
        ],
      ),
    );
  }

  Widget _buildNameField(ThemeData theme) {
    return TextFormField(
      controller: _nameController,
      decoration: const InputDecoration(
        labelText: 'Agency Name *',
        prefixIcon: Icon(Icons.business),
        border: OutlineInputBorder(),
      ),
      textInputAction: TextInputAction.next,
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return 'Please enter agency name';
        }
        return null;
      },
    );
  }

  Widget _buildDescriptionField(ThemeData theme) {
    return TextFormField(
      controller: _descriptionController,
      decoration: const InputDecoration(
        labelText: 'Description',
        hintText: 'Tell us about your agency...',
        prefixIcon: Icon(Icons.description),
        border: OutlineInputBorder(),
        alignLabelWithHint: true,
      ),
      maxLines: 4,
      textInputAction: TextInputAction.next,
    );
  }

  Widget _buildContactSection(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Contact Information',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: _fieldSpacing),
        _buildPhoneField(theme),
        const SizedBox(height: _fieldSpacing),
        _buildEmailField(theme),
        const SizedBox(height: _fieldSpacing),
        _buildWebsiteField(theme),
        const SizedBox(height: _fieldSpacing),
        _buildAddressField(theme),
      ],
    );
  }

  Widget _buildPhoneField(ThemeData theme) {
    return TextFormField(
      controller: _phoneController,
      decoration: const InputDecoration(
        labelText: 'Phone',
        prefixIcon: Icon(Icons.phone),
        border: OutlineInputBorder(),
      ),
      keyboardType: TextInputType.phone,
      textInputAction: TextInputAction.next,
      inputFormatters: [
        FilteringTextInputFormatter.digitsOnly,
      ],
    );
  }

  Widget _buildEmailField(ThemeData theme) {
    return TextFormField(
      controller: _emailController,
      decoration: const InputDecoration(
        labelText: 'Email',
        prefixIcon: Icon(Icons.email),
        border: OutlineInputBorder(),
      ),
      keyboardType: TextInputType.emailAddress,
      textInputAction: TextInputAction.next,
      validator: (value) {
        if (value != null && value.isNotEmpty) {
          final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
          if (!emailRegex.hasMatch(value)) {
            return 'Please enter a valid email';
          }
        }
        return null;
      },
    );
  }

  Widget _buildWebsiteField(ThemeData theme) {
    return TextFormField(
      controller: _websiteController,
      decoration: const InputDecoration(
        labelText: 'Website',
        prefixIcon: Icon(Icons.language),
        border: OutlineInputBorder(),
        hintText: 'example.com',
      ),
      keyboardType: TextInputType.url,
      textInputAction: TextInputAction.next,
      onTap: () async {
        final url = _websiteController.text.trim();
        if (url.isNotEmpty) {
          final normalizedUrl = _normalizeUrl(url);
          if (await canLaunchUrlString(normalizedUrl)) {
            launchUrlString(normalizedUrl);
          }
        }
      },
    );
  }

  Widget _buildAddressField(ThemeData theme) {
    return TextFormField(
      controller: _addressController,
      decoration: const InputDecoration(
        labelText: 'Address',
        prefixIcon: Icon(Icons.location_on),
        border: OutlineInputBorder(),
      ),
      maxLines: 2,
      textInputAction: TextInputAction.done,
    );
  }

  Widget _buildSubmitButton(ThemeData theme) {
    return ElevatedButton(
      onPressed: _isSubmitting ? null : _submitForm,
      style: ElevatedButton.styleFrom(
        minimumSize: const Size.fromHeight(_buttonHeight),
        padding: const EdgeInsets.symmetric(vertical: 12),
      ),
      child: _isSubmitting
          ? const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : Text(
              widget.agency == null ? 'CREATE AGENCY' : 'UPDATE AGENCY',
              style: const TextStyle(fontSize: 16),
            ),
    );
  }
}
