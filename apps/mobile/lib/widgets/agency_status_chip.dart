import 'package:flutter/material.dart';
import '../models/agency.dart';

class AgencyStatusChip extends StatelessWidget {
  final AgencyStatus status;

  const AgencyStatusChip({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(
        status.name, // Using .name for enums (Dart 2.15+)
        style: TextStyle(
          color: _getTextColor(),
          fontWeight: FontWeight.bold,
        ),
      ),
      backgroundColor: _getBackgroundColor(),
    );
  }

  Color _getBackgroundColor() {
    switch (status) {
      case AgencyStatus.pending:
        return Colors.orange.shade100;
      case AgencyStatus.active:
        return Colors.green.shade100;
      case AgencyStatus.suspended:
        return Colors.red.shade100;
    }
  }

  Color _getTextColor() {
    switch (status) {
      case AgencyStatus.pending:
        return Colors.orange.shade800;
      case AgencyStatus.active:
        return Colors.green.shade800;
      case AgencyStatus.suspended:
        return Colors.red.shade800;
    }
  }
}
