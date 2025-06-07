// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contract.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Contract _$ContractFromJson(Map<String, dynamic> json) => Contract(
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
      name: json['name'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$ContractTypeEnumMap, json['type']),
      status: $enumDecode(_$ContractStatusEnumMap, json['status']),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      rentAmount: (json['rentAmount'] as num).toDouble(),
      currency: json['currency'] as String,
      noticePeriod: (json['noticePeriod'] as num).toInt(),
      propertyId: json['propertyId'] as String,
      tenantId: json['tenantId'] as String,
      landlordId: json['landlordId'] as String,
      terms: json['terms'] as Map<String, dynamic>,
      conditions: json['conditions'] as Map<String, dynamic>?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      signedBy: json['signedBy'] as String?,
      signedAt: json['signedAt'] == null
          ? null
          : DateTime.parse(json['signedAt'] as String),
      terminatedBy: json['terminatedBy'] as String?,
      terminatedAt: json['terminatedAt'] == null
          ? null
          : DateTime.parse(json['terminatedAt'] as String),
      cancelledBy: json['cancelledBy'] as String?,
      cancelledAt: json['cancelledAt'] == null
          ? null
          : DateTime.parse(json['cancelledAt'] as String),
      ownerId: json['ownerId'] as String?,
      agencyId: json['agencyId'] as String?,
      property: json['Property'] as Map<String, dynamic>?,
      tenant: json['Tenant'] as Map<String, dynamic>?,
      owner: json['Owner'] as Map<String, dynamic>?,
      agency: json['Agency'] as Map<String, dynamic>?,
      increases: (json['Increase'] as List<dynamic>?)
          ?.map((e) => e as Map<String, dynamic>)
          .toList(),
    );

Map<String, dynamic> _$ContractToJson(Contract instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'name': instance.name,
      'description': instance.description,
      'type': _$ContractTypeEnumMap[instance.type]!,
      'status': _$ContractStatusEnumMap[instance.status]!,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'rentAmount': instance.rentAmount,
      'currency': instance.currency,
      'noticePeriod': instance.noticePeriod,
      'propertyId': instance.propertyId,
      'tenantId': instance.tenantId,
      'landlordId': instance.landlordId,
      'terms': instance.terms,
      'conditions': instance.conditions,
      'metadata': instance.metadata,
      'signedBy': instance.signedBy,
      'signedAt': instance.signedAt?.toIso8601String(),
      'terminatedBy': instance.terminatedBy,
      'terminatedAt': instance.terminatedAt?.toIso8601String(),
      'cancelledBy': instance.cancelledBy,
      'cancelledAt': instance.cancelledAt?.toIso8601String(),
      'ownerId': instance.ownerId,
      'agencyId': instance.agencyId,
      'Property': instance.property,
      'Tenant': instance.tenant,
      'Owner': instance.owner,
      'Agency': instance.agency,
      'Increase': instance.increases,
    };

const _$ContractTypeEnumMap = {
  ContractType.rental: 'RENTAL',
  ContractType.sale: 'SALE',
  ContractType.management: 'MANAGEMENT',
  ContractType.commission: 'COMMISSION',
  ContractType.service: 'SERVICE',
};

const _$ContractStatusEnumMap = {
  ContractStatus.draft: 'DRAFT',
  ContractStatus.active: 'ACTIVE',
  ContractStatus.expired: 'EXPIRED',
  ContractStatus.terminated: 'TERMINATED',
  ContractStatus.renewed: 'RENEWED',
  ContractStatus.pending: 'PENDING',
  ContractStatus.archived: 'ARCHIVED',
};
