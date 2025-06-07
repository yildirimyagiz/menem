import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/contract.dart';
import '../../providers/contract_providers.dart';
import '../../widgets/commons/error_state.dart';
import '../../widgets/commons/loading_state.dart';

class ContractDetailScreen extends ConsumerWidget {
  final Contract contract;

  const ContractDetailScreen({
    super.key,
    required this.contract,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final contractAsync = ref.watch(contractDetailProvider(contract.id));

    return Scaffold(
      appBar: AppBar(
        title: Text(contract.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              Navigator.pushNamed(
                context,
                '/contracts/edit',
                arguments: contract,
              );
            },
          ),
        ],
      ),
      body: contractAsync.when(
        data: (contract) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoCard(context, contract!),
                const SizedBox(height: 16),
                _buildTermsCard(context, contract),
                const SizedBox(height: 16),
                _buildMetadataCard(context, contract),
              ],
            ),
          );
        },
        loading: () => const LoadingState(),
        error: (error, stack) => ErrorState(
          message: error.toString(),
          onRetry: () => ref.refresh(contractDetailProvider(contract.id)),
        ),
      ),
    );
  }

  Widget _buildInfoCard(BuildContext context, Contract contract) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Contract Information',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            _buildInfoRow('Status', contract.status.toString().split('.').last),
            _buildInfoRow(
                'Start Date', contract.startDate.toString().split(' ')[0]),
            _buildInfoRow(
                'End Date', contract.endDate.toString().split(' ')[0]),
            _buildInfoRow('Tenant', contract.tenantId),
            _buildInfoRow('Property', contract.propertyId),
            _buildInfoRow('Agency', contract.agencyId ?? 'Not assigned'),
          ],
        ),
      ),
    );
  }

  Widget _buildTermsCard(BuildContext context, Contract contract) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Terms and Conditions',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Text(contract.description),
            ...[
              const SizedBox(height: 16),
              Text(contract.terms.toString()),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildMetadataCard(BuildContext context, Contract contract) {
    if (contract.metadata == null) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Additional Information',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Text(contract.metadata.toString()),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Text(value),
        ],
      ),
    );
  }
}
