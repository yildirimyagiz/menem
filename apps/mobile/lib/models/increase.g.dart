// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'increase.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Increase _$IncreaseFromJson(Map<String, dynamic> json) => Increase(
      id: json['id'] as String,
      propertyId: json['propertyId'] as String,
      tenantId: json['tenantId'] as String,
      type: $enumDecode(_$IncreaseTypeEnumMap, json['type']),
      amount: (json['amount'] as num).toDouble(),
      effectiveDate: DateTime.parse(json['effectiveDate'] as String),
      reason: json['reason'] as String?,
      status: $enumDecodeNullable(_$IncreaseStatusEnumMap, json['status']) ??
          IncreaseStatus.pending,
      approvedBy: json['approvedBy'] as String?,
      approvedAt: json['approvedAt'] == null
          ? null
          : DateTime.parse(json['approvedAt'] as String),
      rejectedBy: json['rejectedBy'] as String?,
      rejectedAt: json['rejectedAt'] == null
          ? null
          : DateTime.parse(json['rejectedAt'] as String),
      cancelledBy: json['cancelledBy'] as String?,
      cancelledAt: json['cancelledAt'] == null
          ? null
          : DateTime.parse(json['cancelledAt'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
    );

Map<String, dynamic> _$IncreaseToJson(Increase instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'tenantId': instance.tenantId,
      'type': _$IncreaseTypeEnumMap[instance.type]!,
      'amount': instance.amount,
      'effectiveDate': instance.effectiveDate.toIso8601String(),
      'reason': instance.reason,
      'status': _$IncreaseStatusEnumMap[instance.status]!,
      'approvedBy': instance.approvedBy,
      'approvedAt': instance.approvedAt?.toIso8601String(),
      'rejectedBy': instance.rejectedBy,
      'rejectedAt': instance.rejectedAt?.toIso8601String(),
      'cancelledBy': instance.cancelledBy,
      'cancelledAt': instance.cancelledAt?.toIso8601String(),
      'metadata': instance.metadata,
    };

const _$IncreaseTypeEnumMap = {
  IncreaseType.percentage: 'PERCENTAGE',
  IncreaseType.fixed: 'FIXED',
};

const _$IncreaseStatusEnumMap = {
  IncreaseStatus.pending: 'PENDING',
  IncreaseStatus.approved: 'APPROVED',
  IncreaseStatus.rejected: 'REJECTED',
  IncreaseStatus.cancelled: 'CANCELLED',
};

IncreaseModel _$IncreaseModelFromJson(Map<String, dynamic> json) =>
    IncreaseModel(
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
      type: $enumDecode(_$IncreaseTypeEnumMap, json['type']),
      status: $enumDecode(_$IncreaseStatusEnumMap, json['status']),
      value: (json['value'] as num).toDouble(),
      currency: json['currency'] as String,
      effectiveDate: DateTime.parse(json['effectiveDate'] as String),
      propertyId: json['propertyId'] as String,
      approvedBy: json['approvedBy'] as String?,
      approvedAt: json['approvedAt'] == null
          ? null
          : DateTime.parse(json['approvedAt'] as String),
      rejectionReason: json['rejectionReason'] as String?,
      rejectedAt: json['rejectedAt'] == null
          ? null
          : DateTime.parse(json['rejectedAt'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
      customFields: json['customFields'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$IncreaseModelToJson(IncreaseModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'description': instance.description,
      'type': _$IncreaseTypeEnumMap[instance.type]!,
      'status': _$IncreaseStatusEnumMap[instance.status]!,
      'value': instance.value,
      'currency': instance.currency,
      'effectiveDate': instance.effectiveDate.toIso8601String(),
      'propertyId': instance.propertyId,
      'approvedBy': instance.approvedBy,
      'approvedAt': instance.approvedAt?.toIso8601String(),
      'rejectionReason': instance.rejectionReason,
      'rejectedAt': instance.rejectedAt?.toIso8601String(),
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
      'customFields': instance.customFields,
    };
