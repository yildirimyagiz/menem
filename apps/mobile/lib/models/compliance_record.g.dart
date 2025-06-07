// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compliance_record.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ComplianceRecord _$ComplianceRecordFromJson(Map<String, dynamic> json) =>
    ComplianceRecord(
      id: json['id'] as String,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      title: json['title'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$ComplianceTypeEnumMap, json['type']),
      status: $enumDecode(_$ComplianceStatusEnumMap, json['status']),
      entityId: json['entityId'] as String,
      entityType: json['entityType'] as String?,
      issueDate: DateTime.parse(json['issueDate'] as String),
      expiryDate: DateTime.parse(json['expiryDate'] as String),
      issuer: json['issuer'] as String?,
      documentNumber: json['documentNumber'] as String?,
      documentUrl: json['documentUrl'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      approvedBy: json['approvedBy'] as String?,
      approvedAt: json['approvedAt'] == null
          ? null
          : DateTime.parse(json['approvedAt'] as String),
      rejectionReason: json['rejectionReason'] as String?,
      rejectedAt: json['rejectedAt'] == null
          ? null
          : DateTime.parse(json['rejectedAt'] as String),
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList(),
      isRequired: json['isRequired'] as bool,
      renewalPeriod: (json['renewalPeriod'] as num?)?.toInt(),
      lastRenewedAt: json['lastRenewedAt'] == null
          ? null
          : DateTime.parse(json['lastRenewedAt'] as String),
      customFields: json['customFields'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$ComplianceRecordToJson(ComplianceRecord instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'description': instance.description,
      'type': _$ComplianceTypeEnumMap[instance.type]!,
      'status': _$ComplianceStatusEnumMap[instance.status]!,
      'entityId': instance.entityId,
      'entityType': instance.entityType,
      'issueDate': instance.issueDate.toIso8601String(),
      'expiryDate': instance.expiryDate.toIso8601String(),
      'issuer': instance.issuer,
      'documentNumber': instance.documentNumber,
      'documentUrl': instance.documentUrl,
      'metadata': instance.metadata,
      'approvedBy': instance.approvedBy,
      'approvedAt': instance.approvedAt?.toIso8601String(),
      'rejectionReason': instance.rejectionReason,
      'rejectedAt': instance.rejectedAt?.toIso8601String(),
      'tags': instance.tags,
      'isRequired': instance.isRequired,
      'renewalPeriod': instance.renewalPeriod,
      'lastRenewedAt': instance.lastRenewedAt?.toIso8601String(),
      'customFields': instance.customFields,
    };

const _$ComplianceTypeEnumMap = {
  ComplianceType.license: 'LICENSE',
  ComplianceType.certification: 'CERTIFICATION',
  ComplianceType.insurance: 'INSURANCE',
  ComplianceType.permit: 'PERMIT',
  ComplianceType.other: 'OTHER',
};

const _$ComplianceStatusEnumMap = {
  ComplianceStatus.pending: 'PENDING',
  ComplianceStatus.approved: 'APPROVED',
  ComplianceStatus.rejected: 'REJECTED',
  ComplianceStatus.expired: 'EXPIRED',
};
