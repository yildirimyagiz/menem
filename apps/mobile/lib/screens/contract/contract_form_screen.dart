import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/contract.dart';
import '../../providers/contract_providers.dart';

class ContractFormScreen extends ConsumerStatefulWidget {
  final Contract? contract;

  const ContractFormScreen({
    super.key,
    this.contract,
  });

  @override
  ConsumerState<ContractFormScreen> createState() => _ContractFormScreenState();
}

class _ContractFormScreenState extends ConsumerState<ContractFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;
  late DateTime _startDate;
  late DateTime _endDate;
  late String _tenantId;
  late String _propertyId;
  late ContractStatus _status;
  late ContractType _type;
  late double _rentAmount;
  late String _currency;
  late int _noticePeriod;
  late String _landlordId;
  Map<String, dynamic>? _terms;
  Map<String, dynamic>? _metadata;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.contract?.name);
    _descriptionController =
        TextEditingController(text: widget.contract?.description);
    _startDate = widget.contract?.startDate ?? DateTime.now();
    _endDate = widget.contract?.endDate ??
        DateTime.now().add(const Duration(days: 365));
    _tenantId = widget.contract?.tenantId ?? '';
    _propertyId = widget.contract?.propertyId ?? '';
    _status = widget.contract?.status ?? ContractStatus.draft;
    _type = widget.contract?.type ?? ContractType.rental;
    _rentAmount = widget.contract?.rentAmount ?? 0.0;
    _currency = widget.contract?.currency ?? 'USD';
    _noticePeriod = widget.contract?.noticePeriod ?? 30;
    _landlordId = widget.contract?.landlordId ?? '';
    _terms = widget.contract?.terms;
    _metadata = widget.contract?.metadata;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, bool isStartDate) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isStartDate ? _startDate : _endDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 3650)),
    );
    if (picked != null) {
      setState(() {
        if (isStartDate) {
          _startDate = picked;
        } else {
          _endDate = picked;
        }
      });
    }
  }

  Future<void> _saveContract() async {
    if (!_formKey.currentState!.validate()) return;

    final contract = Contract(
      id: widget.contract?.id ??
          DateTime.now().millisecondsSinceEpoch.toString(),
      name: _nameController.text,
      description: _descriptionController.text,
      type: _type,
      status: _status,
      startDate: _startDate,
      endDate: _endDate,
      rentAmount: _rentAmount,
      currency: _currency,
      noticePeriod: _noticePeriod,
      tenantId: _tenantId,
      propertyId: _propertyId,
      landlordId: _landlordId,
      terms: _terms ?? {},
      metadata: _metadata,
      createdAt: widget.contract?.createdAt ?? DateTime.now(),
      updatedAt: DateTime.now(),
      deletedAt: widget.contract?.deletedAt,
    );

    try {
      if (widget.contract == null) {
        await ref.read(contractsProvider.notifier).createContract(contract);
      } else {
        await ref.read(contractsProvider.notifier).updateContract(contract.id, contract.toJson());
      }
      if (mounted) {
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving contract: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.contract == null ? 'New Contract' : 'Edit Contract'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Contract Name',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a contract name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a description';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ListTile(
                    title: const Text('Start Date'),
                    subtitle: Text(_startDate.toString().split(' ')[0]),
                    onTap: () => _selectDate(context, true),
                  ),
                ),
                Expanded(
                  child: ListTile(
                    title: const Text('End Date'),
                    subtitle: Text(_endDate.toString().split(' ')[0]),
                    onTap: () => _selectDate(context, false),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<ContractStatus>(
              value: _status,
              decoration: const InputDecoration(
                labelText: 'Status',
                border: OutlineInputBorder(),
              ),
              items: ContractStatus.values.map((status) {
                return DropdownMenuItem(
                  value: status,
                  child: Text(status.toString().split('.').last),
                );
              }).toList(),
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    _status = value;
                  });
                }
              },
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _saveContract,
        label: const Text('Save Contract'),
        icon: const Icon(Icons.save),
      ),
    );
  }
}
