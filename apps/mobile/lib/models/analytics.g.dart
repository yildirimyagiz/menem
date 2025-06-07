// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Analytics _$AnalyticsFromJson(Map<String, dynamic> json) => Analytics(
      id: json['id'] as String,
      isActive: json['isActive'] as bool?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      entityId: json['entityId'] as String,
      entityType: json['entityType'] as String,
      type: $enumDecode(_$AnalyticsTypeEnumMap, json['type']),
      data: json['data'] as Map<String, dynamic>,
      timestamp: DateTime.parse(json['timestamp'] as String),
      propertyId: json['propertyId'] as String?,
      userId: json['userId'] as String?,
      agentId: json['agentId'] as String?,
      agencyId: json['agencyId'] as String?,
      reservationId: json['reservationId'] as String?,
      taskId: json['taskId'] as String?,
      agency: json['Agency'] as Map<String, dynamic>?,
      agent: json['Agent'] as Map<String, dynamic>?,
      property: json['Property'] as Map<String, dynamic>?,
      reservation: json['Reservation'] as Map<String, dynamic>?,
      task: json['Task'] as Map<String, dynamic>?,
      user: json['User'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$AnalyticsToJson(Analytics instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'isActive': instance.isActive,
      'entityId': instance.entityId,
      'entityType': instance.entityType,
      'type': _$AnalyticsTypeEnumMap[instance.type]!,
      'data': instance.data,
      'timestamp': instance.timestamp.toIso8601String(),
      'propertyId': instance.propertyId,
      'userId': instance.userId,
      'agentId': instance.agentId,
      'agencyId': instance.agencyId,
      'reservationId': instance.reservationId,
      'taskId': instance.taskId,
      'Agency': instance.agency,
      'Agent': instance.agent,
      'Property': instance.property,
      'Reservation': instance.reservation,
      'Task': instance.task,
      'User': instance.user,
    };

const _$AnalyticsTypeEnumMap = {
  AnalyticsType.listingView: 'LISTING_VIEW',
  AnalyticsType.bookingConversion: 'BOOKING_CONVERSION',
  AnalyticsType.userEngagement: 'USER_ENGAGEMENT',
  AnalyticsType.revenue: 'REVENUE',
  AnalyticsType.performance: 'PERFORMANCE',
  AnalyticsType.agentPerformance: 'AGENT_PERFORMANCE',
  AnalyticsType.agencyPerformance: 'AGENCY_PERFORMANCE',
  AnalyticsType.view: 'VIEW',
};
