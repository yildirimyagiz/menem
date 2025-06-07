import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:awesome_snackbar_content/awesome_snackbar_content.dart';
import 'package:intl/intl.dart';
import '../../models/availability.dart';
import '../../widgets/availability_filter_dialog.dart';
import '../../providers/availability_providers.dart';

class AvailabilityListScreen extends ConsumerStatefulWidget {
  final String propertyId;

  const AvailabilityListScreen({
    super.key,
    required this.propertyId,
  });

  @override
  ConsumerState<AvailabilityListScreen> createState() =>
      _AvailabilityListScreenState();
}

class _AvailabilityListScreenState
    extends ConsumerState<AvailabilityListScreen> {
  DateTime? _startDate;
  DateTime? _endDate;

  // Provider for the availability list
  final availabilityListProvider = availabilityListNotifierProvider;

  get value => null;

  @override
  void initState() {
    super.initState();
    // Trigger initial load
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(availabilityListProvider.notifier).loadAvailabilities(
            propertyId: widget.propertyId,
          );
    });
  }

  void _showSnackBar({
    required BuildContext context,
    required String title,
    required String message,
    required ContentType contentType,
  }) {
    final snackBar = SnackBar(
      elevation: 0,
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.transparent,
      content: AwesomeSnackbarContent(
        title: title,
        message: message,
        contentType: contentType,
      ),
    );
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    return Consumer(
      builder: (context, ref, _) {
        final availabilityListAsync = ref.watch(availabilityListProvider);

        return availabilityListAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stack) => Center(child: Text('Error: $error')),
          data: (availabilities) {
            return Scaffold(
              appBar: AppBar(
                title: const Text('Availability'),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.filter_list),
                    onPressed: () => _showFilterDialog(ref.context),
                  ),
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: () => _showAddAvailabilityDialog(ref.context),
                  ),
                ],
              ),
              body: availabilities.isEmpty
                  ? const Center(
                      child: Text('No availabilities found'),
                    )
                  : _buildAvailabilityList(availabilities),
            );
          },
        );
      },
    );
  }

  Widget _buildAvailabilityList(List<Availability> availabilities) {
    return ListView.builder(
      itemCount: availabilities.length,
      itemBuilder: (context, index) {
        final availability = availabilities[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: ListTile(
            title: Text(
              DateFormat('MMM d, y').format(availability.date),
              style: Theme.of(context).textTheme.titleMedium,
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(
                  'Status: ${availability.isBlocked ? 'Blocked' : availability.isBooked ? 'Booked' : 'Available'}',
                  style: TextStyle(
                    color: availability.isBlocked
                        ? Colors.red
                        : availability.isBooked
                            ? Colors.orange
                            : Colors.green,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Units: ${availability.availableUnits}/${availability.totalUnits} available',
                ),
                Text(
                  'Price: \$${availability.currentPrice.toStringAsFixed(2)}',
                ),
              ],
            ),
            trailing: PopupMenuButton(
              itemBuilder: (context) => [
                if (!availability.isBlocked && !availability.isBooked)
                  const PopupMenuItem(
                    value: 'block',
                    child: Text('Block Dates'),
                  ),
                if (availability.isBlocked)
                  const PopupMenuItem(
                    value: 'unblock',
                    child: Text('Unblock Dates'),
                  ),
                const PopupMenuItem(
                  value: 'edit',
                  child: Text('Edit Pricing'),
                ),
                const PopupMenuItem(
                  value: 'delete',
                  child: Text('Delete'),
                ),
              ],
              onSelected: (value) => _handleMenuAction(value, availability),
            ),
          ),
        );
      },
    );
  }

  void _showFilterDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AvailabilityFilterDialog(
        startDate: _startDate,
        endDate: _endDate,
        onFilter: (startDate, endDate) {
          setState(() {
            _startDate = startDate;
            _endDate = endDate;
          });
          ref.read(availabilityListProvider.notifier).loadAvailabilities(
                propertyId: widget.propertyId,
                startDate: startDate,
                endDate: endDate,
              );
        },
      ),
    );
  }

  void _showAddAvailabilityDialog(BuildContext context) {
    final formKey = GlobalKey<FormState>();
    DateTime startDate = DateTime.now();
    DateTime endDate =
        DateTime.now().add(const Duration(days: 1)); // Default end date
    int units = 1;

    // Use a StatefulWidget for the dialog content if dates need to update reactively within the dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Availability'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: const Text('Start Date'),
                subtitle: Text(DateFormat('MMM d, y').format(startDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context:
                        context, // Ensure this context is from the dialog builder
                    initialDate: startDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    // To update UI inside dialog, dialog content needs to be a StatefulWidget
                    startDate = picked;
                    if (endDate.isBefore(startDate)) {
                      endDate = startDate;
                    }
                  }
                },
              ),
              ListTile(
                title: const Text('End Date'),
                subtitle: Text(DateFormat('MMM d, y').format(endDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: endDate,
                    firstDate: startDate,
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    endDate = picked;
                    // To update UI inside dialog, dialog content needs to be a StatefulWidget
                  }
                },
              ),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Units',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                initialValue: '1',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter number of units';
                  }
                  final units = int.tryParse(value);
                  if (units == null || units <= 0) {
                    return 'Please enter a valid number of units';
                  }
                  return null;
                },
                onSaved: (value) => units = int.tryParse(value ?? '1') ?? 1,
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Price',
                  border: OutlineInputBorder(),
                  prefixText: '\$',
                ),
                keyboardType: TextInputType.number,
                initialValue: '0.00',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a price';
                  }
                  final price = double.tryParse(value);
                  if (price == null || price < 0) {
                    return 'Please enter a valid price';
                  }
                  return null;
                },
                onSaved: (value),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                final notifier = ref.read(availabilityListProvider.notifier);

                try {
                  // Show loading indicator
                  if (context.mounted) {
                    showDialog(
                      context: context,
                      barrierDismissible: false,
                      builder: (context) => const Center(
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }

                  // Use blockDates to create availability for the date range
                  await notifier.blockDates(
                    propertyId: widget.propertyId,
                    startDate: startDate,
                    endDate: endDate,
                    units: units,
                    reason: 'Manual availability update',
                  );

                  // Close loading dialog
                  if (context.mounted) {
                    Navigator.pop(context); // Close loading dialog
                    Navigator.pop(context); // Close add availability dialog

                    // Show success message
                    _showSnackBar(
                      context: context,
                      title: 'Success',
                      message: 'Availability created successfully',
                      contentType: ContentType.success,
                    );
                  }
                } catch (e) {
                  // Close loading dialog if still mounted
                  if (context.mounted) {
                    Navigator.pop(context); // Close loading dialog

                    // Show error message
                    _showSnackBar(
                      context: context,
                      title: 'Error',
                      message: 'Failed to create availability: $e',
                      contentType: ContentType.failure,
                    );
                  }
                }
                _showSnackBar(
                  // ignore: use_build_context_synchronously
                  context:
                      context, // This context might be an issue if dialog is popped.
                  // Consider getting ScaffoldMessenger.of(context) before popping.
                  title: 'Success',
                  message: 'Availability created for the selected date range.',
                  contentType: ContentType.success,
                );
                // Optionally refresh the list if createAvailability doesn't do it
                // ref.read(availabilityListProvider.notifier).loadAvailabilities(propertyId: widget.propertyId);
              } else {
                // Handle validation failure if needed
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _handleMenuAction(String value, Availability availability) {
    switch (value) {
      case 'block':
        _showBlockDatesDialog(availability);
        break;
      case 'unblock':
        _showUnblockDatesDialog(availability);
        break;
      case 'edit':
        _showEditPricingDialog(availability);
        break;
      case 'delete':
        _showDeleteConfirmationDialog(availability);
        break;
    }
  }

  void _showBlockDatesDialog(Availability availability) {
    final formKey = GlobalKey<FormState>();
    DateTime startDate = availability.date;
    DateTime endDate = availability.date;
    int unitsToBlock = availability.availableUnits > 0
        ? 1
        : 0; // Default to blocking 1 unit if available
    String? reason;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Block Dates'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: const Text('Start Date'),
                subtitle: Text(DateFormat('MMM d, y').format(startDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: startDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    startDate = picked;
                    if (endDate.isBefore(startDate)) {
                      endDate = startDate;
                    }
                  }
                },
              ),
              ListTile(
                title: const Text('End Date'),
                subtitle: Text(DateFormat('MMM d, y').format(endDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: endDate,
                    firstDate: startDate,
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    endDate = picked;
                  }
                },
              ),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Units to Block',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                initialValue: unitsToBlock.toString(),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter number of units';
                  }
                  final units = int.tryParse(value);
                  if (units == null || units <= 0) {
                    return 'Please enter a valid number of units';
                  }
                  if (units > availability.availableUnits) {
                    return 'Cannot block more units than available';
                  }
                  return null;
                },
                onSaved: (value) => unitsToBlock = int.parse(value!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Reason (Optional)',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
                onSaved: (value) => reason = value,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                ref.read(availabilityListProvider.notifier).blockDates(
                      propertyId: widget.propertyId,
                      startDate: startDate,
                      endDate: endDate,
                      units: unitsToBlock,
                      reason: reason, // Pass the reason
                    );
                Navigator.pop(context);
              }
            },
            child: const Text('Block'),
          ),
        ],
      ),
    );
  }

  void _showUnblockDatesDialog(Availability availability) {
    final formKey = GlobalKey<FormState>();
    DateTime startDate = availability.date;
    DateTime endDate = availability.date;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Unblock Dates'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: const Text('Start Date'),
                subtitle: Text(DateFormat('MMM d, y').format(startDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: startDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    startDate = picked;
                    if (endDate.isBefore(startDate)) {
                      endDate = startDate;
                    }
                  }
                },
              ),
              ListTile(
                title: const Text('End Date'),
                subtitle: Text(DateFormat('MMM d, y').format(endDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: endDate,
                    firstDate: startDate,
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    endDate = picked;
                  }
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                ref.read(availabilityListProvider.notifier).unblockDates(
                      propertyId: widget.propertyId,
                      startDate: startDate,
                      endDate: endDate,
                    );
                Navigator.pop(context);
              }
            },
            child: const Text('Unblock'),
          ),
        ],
      ),
    );
  }

  void _showEditPricingDialog(Availability availability) {
    final formKey = GlobalKey<FormState>();
    DateTime startDate = availability.date;
    DateTime endDate = availability.date;
    double price = availability.currentPrice;
    Map<String, dynamic>? settings;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Pricing'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: const Text('Start Date'),
                subtitle: Text(DateFormat('MMM d, y').format(startDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: startDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    startDate = picked;
                    if (endDate.isBefore(startDate)) {
                      endDate = startDate;
                    }
                  }
                },
              ),
              ListTile(
                title: const Text('End Date'),
                subtitle: Text(DateFormat('MMM d, y').format(endDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: endDate,
                    firstDate: startDate,
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    endDate = picked;
                  }
                },
              ),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Price',
                  border: OutlineInputBorder(),
                  prefixText: '\$',
                ),
                keyboardType: TextInputType.number,
                initialValue: price.toStringAsFixed(2),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a price';
                  }
                  final price = double.tryParse(value);
                  if (price == null || price < 0) {
                    return 'Please enter a valid price';
                  }
                  return null;
                },
                onSaved: (value) => price = double.parse(value!),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                formKey.currentState!.save();
                ref.read(availabilityListProvider.notifier).updatePricing(
                      propertyId: widget.propertyId,
                      startDate: startDate,
                      endDate: endDate,
                      price: price,
                      settings: settings,
                    );
                Navigator.pop(context);
              }
            },
            child: const Text('Update'),
          ),
        ],
      ),
    );
  }

  void _showDeleteConfirmationDialog(Availability availability) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Availability'),
        content: const Text(
          'Are you sure you want to delete this availability?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              // Use unblockDates to remove the availability
              try {
                await ref.read(availabilityListProvider.notifier).unblockDates(
                      propertyId: availability.propertyId,
                      startDate: availability.date,
                      endDate: availability.date,
                    );
                if (context.mounted) {
                  _showSnackBar(
                    context: context,
                    title: 'Deleted',
                    message: 'Availability deleted successfully.',
                    contentType: ContentType.success,
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  _showSnackBar(
                    context: context,
                    title: 'Error',
                    message: 'Failed to delete availability: $e',
                    contentType: ContentType.failure,
                  );
                }
              } finally {
                if (context.mounted) {
                  Navigator.pop(context);
                }
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
