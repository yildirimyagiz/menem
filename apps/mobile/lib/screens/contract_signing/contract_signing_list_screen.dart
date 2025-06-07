import 'package:flutter/material.dart';
import '../../models/contract_signing.dart';
import 'package:intl/intl.dart';

class ContractSigningListScreen extends StatelessWidget {
  final List<ContractSigning> contractSignings;
  const ContractSigningListScreen({super.key, required this.contractSignings});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Contract Signings')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: contractSignings.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final cs = contractSignings[i];
          return ListTile(
            leading: const Icon(Icons.edit_document),
            title: Text(cs.contractName),
            subtitle: Text(
                'Signed by: ${cs.signedBy}\nDate: ${DateFormat.yMMMd().add_jm().format(cs.signedAt)}'),
            trailing: IconButton(
              icon: const Icon(Icons.more_vert),
              onPressed: () {
                showModalBottomSheet(
                  context: context,
                  builder: (context) => SafeArea(
                    child: Wrap(children: [
                      ListTile(
                        leading: const Icon(Icons.visibility),
                        title: const Text('View Details'),
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.pushNamed(
                            context,
                            '/contract-signings/detail',
                            arguments: cs,
                          );
                        },
                      ),
                    ]),
                  ),
                );
              },
            ),
            onTap: () {},
          );
        },
      ),
    );
  }
}
