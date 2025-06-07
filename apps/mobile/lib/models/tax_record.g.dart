// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tax_record.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TaxRecord _$TaxRecordFromJson(Map<String, dynamic> json) => TaxRecord(
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
      year: (json['year'] as num).toInt(),
      quarter: (json['quarter'] as num).toInt(),
      totalIncome: (json['totalIncome'] as num).toDouble(),
      totalExpenses: (json['totalExpenses'] as num).toDouble(),
      taxableIncome: (json['taxableIncome'] as num).toDouble(),
      taxAmount: (json['taxAmount'] as num).toDouble(),
      status: $enumDecode(_$TaxStatusEnumMap, json['status']),
      dueDate: DateTime.parse(json['dueDate'] as String),
      paidDate: json['paidDate'] == null
          ? null
          : DateTime.parse(json['paidDate'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$TaxRecordToJson(TaxRecord instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'year': instance.year,
      'quarter': instance.quarter,
      'totalIncome': instance.totalIncome,
      'totalExpenses': instance.totalExpenses,
      'taxableIncome': instance.taxableIncome,
      'taxAmount': instance.taxAmount,
      'status': _$TaxStatusEnumMap[instance.status]!,
      'dueDate': instance.dueDate.toIso8601String(),
      'paidDate': instance.paidDate?.toIso8601String(),
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$TaxStatusEnumMap = {
  TaxStatus.pending: 'PENDING',
  TaxStatus.paid: 'PAID',
  TaxStatus.overdue: 'OVERDUE',
  TaxStatus.cancelled: 'CANCELLED',
};
