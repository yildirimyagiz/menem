import 'package:flutter/material.dart';
import '../../models/payment.dart';
import 'package:intl/intl.dart';

class PaymentCard extends StatelessWidget {
  final Payment payment;
  final VoidCallback? onTap;
  const PaymentCard({super.key, required this.payment, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        leading: Icon(
          payment.status == PaymentStatus.completed ? Icons.check_circle : Icons.payments,
          color: payment.status == PaymentStatus.completed ? Colors.green : Colors.blue,
        ),
        title: Text('${payment.amount} ${payment.currency}'),
        subtitle: Text('${payment.type.toString().split('.').last} • ${payment.method.toString().split('.').last}'),
        trailing: Text(payment.paidAt != null ? DateFormat.yMMMd().format(payment.paidAt!) : '-'),
      ),
    );
  }
}
