import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/contract.dart';
import '../../providers/contract_providers.dart';
import '../../widgets/commons/empty_state.dart';
import '../../widgets/commons/error_state.dart';
import '../../widgets/commons/loading_state.dart';
import 'contract_detail_screen.dart';

class ContractListScreen extends ConsumerWidget {
  const ContractListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final contractsAsync = ref.watch(contractsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Contracts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.pushNamed(context, '/contracts/new');
            },
          ),
        ],
      ),
      body: contractsAsync.when(
        data: (contracts) {
          if (contracts.isEmpty) {
            return const EmptyState(
              message: 'No contracts found',
              icon: Icons.description,
            );
          }

          return ListView.builder(
            itemCount: contracts.length,
            itemBuilder: (context, index) {
              final contract = contracts[index];
              return ContractListTile(contract: contract);
            },
          );
        },
        loading: () => const LoadingState(),
        error: (error, stack) => ErrorState(
          message: error.toString(),
          onRetry: () => ref.refresh(contractsProvider.notifier).refresh(),
        ),
      ),
    );
  }
}

class ContractListTile extends StatelessWidget {
  final Contract contract;

  const ContractListTile({
    super.key,
    required this.contract,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(contract.name),
      subtitle: Text(
        '${contract.startDate.toString().split(' ')[0]} - ${contract.endDate.toString().split(' ')[0]}',
      ),
      trailing: Chip(
        label: Text(contract.status.toString().split('.').last),
        backgroundColor: _getStatusColor(contract.status),
      ),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ContractDetailScreen(contract: contract),
          ),
        );
      },
    );
  }

  Color _getStatusColor(ContractStatus status) {
    switch (status) {
      case ContractStatus.draft:
        return Colors.grey;
      case ContractStatus.active:
        return Colors.green;
      default:
        return Colors.blue;
    }
  }
}
