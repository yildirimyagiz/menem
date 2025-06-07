import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/generated/l10n.dart';
import '../../models/compliance_record.dart';

class ComplianceRecordDetailScreen extends StatelessWidget {
  String _getLocalizedComplianceType(
      BuildContext context, ComplianceType type) {
    switch (type) {
      case ComplianceType.license:
        return AppLocalizations.of(context)!.complianceTypeLicense;
      case ComplianceType.certification:
        return AppLocalizations.of(context)!.complianceTypeCertification;
      case ComplianceType.insurance:
        return AppLocalizations.of(context)!.complianceTypeInsurance;
      case ComplianceType.permit:
        return AppLocalizations.of(context)!.complianceTypePermit;
      case ComplianceType.other:
        return AppLocalizations.of(context)!.complianceTypeOther;
    }
  }

  String _getLocalizedComplianceStatus(
      BuildContext context, ComplianceStatus status) {
    switch (status) {
      case ComplianceStatus.pending:
        return AppLocalizations.of(context)!.complianceStatusPending;
      case ComplianceStatus.approved:
        return AppLocalizations.of(context)!.complianceStatusApproved;
      case ComplianceStatus.rejected:
        return AppLocalizations.of(context)!.complianceStatusRejected;
      case ComplianceStatus.expired:
        return AppLocalizations.of(context)!.complianceStatusExpired;
    }
  }

  final ComplianceRecord complianceRecord;
  const ComplianceRecordDetailScreen(
      {super.key, required this.complianceRecord});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();

    return Scaffold(
      appBar: AppBar(
          title:
              Text(AppLocalizations.of(context)!.complianceRecordDetailTitle)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailItem('Title', complianceRecord.title),
            _buildDetailItem('Description', complianceRecord.description),
            _buildDetailItem(AppLocalizations.of(context)!.complianceRecordType,
                _getLocalizedComplianceType(context, complianceRecord.type)),
            _buildDetailItem(
                AppLocalizations.of(context)!.complianceRecordStatus,
                _getLocalizedComplianceStatus(
                    context, complianceRecord.status)),
            _buildDetailItem('Entity ID', complianceRecord.entityId),
            if (complianceRecord.entityType != null)
              _buildDetailItem('Entity Type', complianceRecord.entityType),
            _buildDetailItem(
                'Issue Date',
                yMMMdFormatter.format(complianceRecord
                    .issueDate)), // Assuming complianceRecord.issueDate is effectively non-null here
            _buildDetailItem('Expiry Date',
                yMMMdFormatter.format(complianceRecord.expiryDate)),
            if (complianceRecord.issuer != null)
              _buildDetailItem('Issuer', complianceRecord.issuer),
            if (complianceRecord.documentNumber != null)
              _buildDetailItem(
                  'Document Number', complianceRecord.documentNumber),
            if (complianceRecord.documentUrl != null)
              _buildDetailItem('Document URL', complianceRecord.documentUrl),
            if (complianceRecord.metadata != null) ...[
              const SizedBox(height: 8),
              Text(AppLocalizations.of(context)!.complianceRecordMetadata,
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(complianceRecord.metadata.toString()),
            ],
            if (complianceRecord.approvedBy != null)
              _buildDetailItem('Approved By', complianceRecord.approvedBy),
            if (complianceRecord.approvedAt != null)
              _buildDetailItem('Approved At',
                  yMMMdJmFormatter.format(complianceRecord.approvedAt!)),
            if (complianceRecord.rejectionReason != null)
              _buildDetailItem(
                  'Rejection Reason', complianceRecord.rejectionReason),
            if (complianceRecord.rejectedAt != null)
              _buildDetailItem('Rejected At',
                  yMMMdJmFormatter.format(complianceRecord.rejectedAt!)),
            if (complianceRecord.tags != null)
              _buildDetailItem('Tags', complianceRecord.tags!.join(', ')),
            _buildDetailItem(
                AppLocalizations.of(context)!.commonYes,
                complianceRecord.isRequired
                    ? AppLocalizations.of(context)!.commonYes
                    : AppLocalizations.of(context)!.commonNo),
            if (complianceRecord.renewalPeriod != null)
              _buildDetailItem(
                  'Renewal Period', complianceRecord.renewalPeriod.toString()),
            if (complianceRecord.lastRenewedAt != null)
              _buildDetailItem('Last Renewed At',
                  yMMMdJmFormatter.format(complianceRecord.lastRenewedAt!)),
            if (complianceRecord.customFields != null) ...[
              const SizedBox(height: 8),
              Text(AppLocalizations.of(context)!.complianceRecordCustomFields,
                  style: Theme.of(context).textTheme.titleSmall),
              SelectableText(complianceRecord.customFields.toString()),
            ],
            if (complianceRecord.createdAt != null)
              _buildDetailItem('Created At',
                  yMMMdJmFormatter.format(complianceRecord.createdAt!)),
            if (complianceRecord.updatedAt != null)
              _buildDetailItem('Updated At',
                  yMMMdJmFormatter.format(complianceRecord.updatedAt!)),
            if (complianceRecord.deletedAt != null)
              _buildDetailItem('Deleted At',
                  yMMMdFormatter.format(complianceRecord.deletedAt!)),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(String label, String? value) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 140,
              child: Text(label,
                  style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
