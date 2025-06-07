import 'package:flutter/material.dart';
import 'package:mobile/generated/l10n.dart';
import 'package:intl/intl.dart';
import '../../models/contract.dart';

class ContractDetails extends StatelessWidget {
  final Contract contract;
  const ContractDetails({super.key, required this.contract});

  @override
  Widget build(BuildContext context) {
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(AppLocalizations.of(context)!.contractDetailTitle,
              style: Theme.of(context).textTheme.titleLarge),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractIdLabel, contract.id),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractNameLabel, contract.name),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractDescriptionLabel,
              contract.description),
          _buildDetailItem(AppLocalizations.of(context)!.contractTypeLabel,
              _getLocalizedContractType(context, contract.type)),
          _buildDetailItem(AppLocalizations.of(context)!.contractStatusLabel,
              _getLocalizedContractStatus(context, contract.status)),
          _buildDetailItem(AppLocalizations.of(context)!.contractCurrencyLabel,
              contract.currency),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractRentAmountLabel,
              contract.rentAmount.toString()),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractNoticePeriodLabel,
              contract.noticePeriod.toString()),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractPropertyIdLabel,
              contract.propertyId),
          _buildDetailItem(AppLocalizations.of(context)!.contractTenantIdLabel,
              contract.tenantId),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractLandlordIdLabel,
              contract.landlordId),
          _buildDetailItem(AppLocalizations.of(context)!.contractOwnerIdLabel,
              contract.ownerId),
          _buildDetailItem(AppLocalizations.of(context)!.contractAgencyIdLabel,
              contract.agencyId),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractStartDateLabel,
              // ignore: unnecessary_null_comparison
              contract.startDate != null
                  ? yMMMdFormatter.format(contract.startDate)
                  : ''),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractEndDateLabel,
              // ignore: unnecessary_null_comparison
              contract.endDate != null
                  ? yMMMdFormatter.format(contract.endDate)
                  : ''),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractCreatedAtLabel,
              contract.createdAt != null
                  ? yMMMdJmFormatter.format(contract.createdAt!)
                  : ''),
          _buildDetailItem(
              AppLocalizations.of(context)!.contractUpdatedAtLabel,
              contract.updatedAt != null
                  ? yMMMdJmFormatter.format(contract.updatedAt!)
                  : ''),
          if (contract.deletedAt != null)
            _buildDetailItem(
                AppLocalizations.of(context)!.contractDeletedAtLabel,
                yMMMdFormatter.format(contract.deletedAt!)),
          if (contract.signedBy != null)
            _buildDetailItem(
                AppLocalizations.of(context)!.contractSignedByLabel,
                contract.signedBy),
          if (contract.signedAt != null)
            _buildDetailItem(
                AppLocalizations.of(context)!.contractSignedAtLabel,
                yMMMdJmFormatter.format(contract.signedAt!)),
          if (contract.terminatedBy != null)
            _buildDetailItem(
                AppLocalizations.of(context)!.contractTerminatedByLabel,
                contract.terminatedBy),
          if (contract.terminatedAt != null) // Redundant null check removed
            _buildDetailItem(
                AppLocalizations.of(context)!.contractTerminatedAtLabel,
                yMMMdJmFormatter.format(contract.terminatedAt!)),
          if (contract.cancelledBy != null)
            _buildDetailItem(
                AppLocalizations.of(context)!.contractCancelledByLabel,
                contract.cancelledBy),
          if (contract.cancelledAt != null)
            _buildDetailItem(
                AppLocalizations.of(context)!.contractCancelledAtLabel,
                yMMMdJmFormatter.format(contract.cancelledAt!)),
          const SizedBox(height: 16),
          if (contract.terms.isNotEmpty) ...[
            Text(AppLocalizations.of(context)!.contractTermsLabel,
                style: Theme.of(context).textTheme.titleSmall),
            SelectableText(contract.terms.toString()),
          ],
          if (contract.conditions != null) ...[
            const SizedBox(height: 8),
            Text(AppLocalizations.of(context)!.contractConditionsLabel,
                style: Theme.of(context).textTheme.titleSmall),
            SelectableText(contract.conditions.toString()),
          ],
          if (contract.metadata != null) ...[
            const SizedBox(height: 8),
            Text('Metadata:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(contract.metadata.toString()),
          ],
          if (contract.property != null) ...[
            const SizedBox(height: 8),
            Text('Property:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(contract.property.toString()),
          ],
          if (contract.tenant != null) ...[
            const SizedBox(height: 8),
            Text('Tenant:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(contract.tenant.toString()),
          ],
          if (contract.owner != null) ...[
            const SizedBox(height: 8),
            Text('Owner:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(contract.owner.toString()),
          ],
          if (contract.agency != null) ...[
            const SizedBox(height: 8),
            Text('Agency:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(contract.agency.toString()),
          ],
          if (contract.increases != null && contract.increases!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text('Increases:', style: Theme.of(context).textTheme.titleSmall),
            SelectableText(contract.increases.toString()),
          ],
        ],
      ),
    );
  }

  String _getLocalizedContractType(BuildContext context, ContractType type) {
    switch (type) {
      case ContractType.rental:
        return AppLocalizations.of(context)!.contractTypeRental;
      case ContractType.sale:
        return AppLocalizations.of(context)!.contractTypeSale;
      case ContractType.management:
        return AppLocalizations.of(context)!.contractTypeManagement;
      case ContractType.commission:
        return AppLocalizations.of(context)!.contractTypeCommission;
      case ContractType.service:
        return AppLocalizations.of(context)!.contractTypeService;
    }
  }

  String? _getLocalizedContractStatus(
      BuildContext context, ContractStatus status) {
    switch (status) {
      case ContractStatus.draft:
        return AppLocalizations.of(context)!.contractStatusDraft;
      case ContractStatus.active:
        return AppLocalizations.of(context)!
            .contractStatusActive; // This is where the undefined_getter error occurs
      case ContractStatus.expired:
        return AppLocalizations.of(context)!.contractStatusExpired;
      case ContractStatus.terminated:
        return AppLocalizations.of(context)!.contractStatusTerminated;
      case ContractStatus.renewed:
        return AppLocalizations.of(context)!.contractStatusRenewed;
      case ContractStatus.pending:
        return AppLocalizations.of(context)!.contractStatusPending;
      case ContractStatus.archived:
        return AppLocalizations.of(context)!.contractStatusArchived;
    }
  }

  Widget _buildDetailItem(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(value ?? '', overflow: TextOverflow.ellipsis),
          ),
        ],
      ),
    );
  }
}
