import 'package:flutter/material.dart';
import '../../models/contract.dart';
import 'contract_details.dart';

class ContractCard extends StatelessWidget {
  final Contract contract;
  final VoidCallback? onTap;

  const ContractCard({super.key, required this.contract, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ContractDetails(contract: contract),
        ),
      ),
    );
  }
}
