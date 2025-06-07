// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mortgage.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Mortgage _$MortgageFromJson(Map<String, dynamic> json) => Mortgage(
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
      propertyId: json['propertyId'] as String,
      userId: json['userId'] as String,
      amount: (json['amount'] as num).toDouble(),
      interestRate: (json['interestRate'] as num).toDouble(),
      termInMonths: (json['termInMonths'] as num).toInt(),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] == null
          ? null
          : DateTime.parse(json['endDate'] as String),
      status: $enumDecode(_$MortgageStatusEnumMap, json['status']),
      description: json['description'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      currencyId: json['currencyId'] as String?,
      agencyId: json['agencyId'] as String?,
      agentId: json['agentId'] as String?,
    );

Map<String, dynamic> _$MortgageToJson(Mortgage instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'userId': instance.userId,
      'amount': instance.amount,
      'interestRate': instance.interestRate,
      'termInMonths': instance.termInMonths,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'status': _$MortgageStatusEnumMap[instance.status]!,
      'description': instance.description,
      'metadata': instance.metadata,
      'currencyId': instance.currencyId,
      'agencyId': instance.agencyId,
      'agentId': instance.agentId,
    };

const _$MortgageStatusEnumMap = {
  MortgageStatus.pending: 'PENDING',
  MortgageStatus.approved: 'APPROVED',
  MortgageStatus.rejected: 'REJECTED',
  MortgageStatus.active: 'ACTIVE',
  MortgageStatus.paid: 'PAID',
  MortgageStatus.defaulted: 'DEFAULTED',
};
