import 'package:flutter/material.dart';
import '../../models/currency.dart';

class CurrencyListScreen extends StatelessWidget {
  final List<Currency> currencies;
  const CurrencyListScreen({super.key, required this.currencies});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Currencies')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: currencies.length,
        separatorBuilder: (_, __) => const Divider(),
        itemBuilder: (context, i) {
          final c = currencies[i];
          return ListTile(
            leading: const Icon(Icons.attach_money),
            title: Text('${c.code} - ${c.name}'),
            subtitle: Text('Symbol: ${c.symbol}'),
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
                        onTap: () => Navigator.pop(context),
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
