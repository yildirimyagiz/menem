// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Report _$ReportFromJson(Map<String, dynamic> json) => Report(
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
      type: $enumDecode(_$ReportTypeEnumMap, json['type']),
      status: $enumDecode(_$ReportStatusEnumMap, json['status']),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      propertyId: json['propertyId'] as String?,
      userId: json['userId'] as String?,
      agencyId: json['agencyId'] as String?,
      data: json['data'] as Map<String, dynamic>?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$ReportToJson(Report instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'description': instance.description,
      'type': _$ReportTypeEnumMap[instance.type]!,
      'status': _$ReportStatusEnumMap[instance.status]!,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'propertyId': instance.propertyId,
      'userId': instance.userId,
      'agencyId': instance.agencyId,
      'data': instance.data,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$ReportTypeEnumMap = {
  ReportType.financial: 'FINANCIAL',
  ReportType.occupancy: 'OCCUPANCY',
  ReportType.maintenance: 'MAINTENANCE',
  ReportType.performance: 'PERFORMANCE',
  ReportType.other: 'OTHER',
};

const _$ReportStatusEnumMap = {
  ReportStatus.draft: 'DRAFT',
  ReportStatus.published: 'PUBLISHED',
  ReportStatus.archived: 'ARCHIVED',
};
