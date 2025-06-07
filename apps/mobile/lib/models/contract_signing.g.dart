// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contract_signing.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ContractSigning _$ContractSigningFromJson(Map<String, dynamic> json) =>
    ContractSigning(
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
      contractId: json['contractId'] as String,
      signedBy: json['signedBy'] as String,
      signedAt: DateTime.parse(json['signedAt'] as String),
      notes: json['notes'] as String?,
      contract: json['contract'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$ContractSigningToJson(ContractSigning instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'contractId': instance.contractId,
      'signedBy': instance.signedBy,
      'signedAt': instance.signedAt.toIso8601String(),
      'notes': instance.notes,
      'contract': instance.contract,
    };
