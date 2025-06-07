import 'package:flutter/material.dart';
import '../../models/facility.dart';
import 'package:intl/intl.dart';
import 'package:mobile/generated/l10n.dart';

class FacilityDetailScreen extends StatelessWidget {
  final Facility facility;
  const FacilityDetailScreen({super.key, required this.facility});

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!; // Use generated localization
    final DateFormat yMMMdFormatter = DateFormat.yMMMd();
    final DateFormat yMMMdJmFormatter = DateFormat.yMMMd().add_jm();
    return Scaffold(
      appBar: AppBar(title: Text(facility.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(s.facilityDetailTitle,
                style: Theme.of(context).textTheme.titleLarge),
            _buildDetailItem(s.facilityDetailId, facility.id),
            _buildDetailItem(s.facilityDetailName, facility.name),
            _buildDetailItem(s.facilityDetailDescription, facility.description),
            _buildDetailItem(s.facilityDetailType,
                _getLocalizedFacilityType(context, facility.type)),
            _buildDetailItem(s.facilityDetailStatus,
                _getLocalizedFacilityStatus(context, facility.status)),
            _buildDetailItem(s.facilityDetailPropertyId, facility.propertyId),
            _buildDetailItem(s.facilityDetailLocation, facility.location),
            if (facility.metadata != null)
              _buildDetailItem(
                  s.facilityDetailMetadata, facility.metadata.toString(),
                  selectable: true),
            _buildDetailItem(s.facilityDetailCreatedBy, facility.createdBy),
            _buildDetailItem(s.facilityDetailUpdatedBy, facility.updatedBy),
            _buildDetailItem(
                s.facilityDetailCreatedAt,
                facility.createdAt != null
                    ? yMMMdJmFormatter.format(facility.createdAt!)
                    : null),
            _buildDetailItem(
                s.facilityDetailUpdatedAt,
                facility.updatedAt != null
                    ? yMMMdJmFormatter.format(facility.updatedAt!)
                    : null),
            if (facility.deletedAt != null)
              _buildDetailItem(s.facilityDetailDeletedAt,
                  yMMMdFormatter.format(facility.deletedAt!)),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(String label, String? value,
      {bool selectable = false}) {
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
          Expanded(
            child: selectable ? SelectableText(value) : Text(value),
          ),
        ],
      ),
    );
  }

  String _getLocalizedFacilityType(BuildContext context, FacilityType type) {
    final s = AppLocalizations.of(context)!;
    switch (type) {
      case FacilityType.gym:
        return s.facilityTypeGym;
      case FacilityType.pool:
        return s.facilityTypePool;
      case FacilityType.parking:
        return s.facilityTypeParkingLot;
      case FacilityType.laundry:
        return s.facilityTypeLaundry;
      case FacilityType.elevator:
        return s.facilityTypeElevator;
      case FacilityType.security:
        return s.facilityTypeSecurity;
      case FacilityType.other:
        return s.facilityTypeOther;
    }
  }

  String _getLocalizedFacilityStatus(
      BuildContext context, FacilityStatus status) {
    final s = AppLocalizations.of(context)!;
    switch (status) {
      case FacilityStatus.available:
        return s.facilityStatusAvailable;
      case FacilityStatus.unavailable:
        return s.facilityStatusUnavailable;
      case FacilityStatus.maintenance:
        return s.facilityStatusMaintenance;
    }
  }
}
