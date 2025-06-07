// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'event.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Event _$EventFromJson(Map<String, dynamic> json) => Event(
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
      property: Property.fromJson(json['property'] as Map<String, dynamic>),
      title: json['title'] as String,
      description: json['description'] as String?,
      eventType: $enumDecode(_$EventTypeEnumMap, json['eventType']),
      scheduledAt: DateTime.parse(json['scheduledAt'] as String),
      duration: (json['duration'] as num?)?.toInt(),
      createdById: json['createdById'] as String?,
      createdBy: json['createdBy'] == null
          ? null
          : User.fromJson(json['createdBy'] as Map<String, dynamic>),
      attendees: (json['attendees'] as List<dynamic>)
          .map((e) => User.fromJson(e as Map<String, dynamic>))
          .toList(),
      isActive: json['isActive'] as bool,
      status: $enumDecode(_$EventStatusEnumMap, json['status']),
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: DateTime.parse(json['endTime'] as String),
      location: json['location'] as String?,
      userId: json['userId'] as String?,
      agencyId: json['agencyId'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$EventToJson(Event instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'property': instance.property,
      'title': instance.title,
      'description': instance.description,
      'eventType': _$EventTypeEnumMap[instance.eventType]!,
      'scheduledAt': instance.scheduledAt.toIso8601String(),
      'duration': instance.duration,
      'createdById': instance.createdById,
      'createdBy': instance.createdBy,
      'attendees': instance.attendees,
      'isActive': instance.isActive,
      'status': _$EventStatusEnumMap[instance.status]!,
      'startTime': instance.startTime.toIso8601String(),
      'endTime': instance.endTime.toIso8601String(),
      'location': instance.location,
      'userId': instance.userId,
      'agencyId': instance.agencyId,
      'metadata': instance.metadata,
      'updatedBy': instance.updatedBy,
    };

const _$EventTypeEnumMap = {
  EventType.viewing: 'VIEWING',
  EventType.openHouse: 'OPEN_HOUSE',
  EventType.maintenance: 'MAINTENANCE',
  EventType.inspection: 'INSPECTION',
  EventType.other: 'OTHER',
};

const _$EventStatusEnumMap = {
  EventStatus.scheduled: 'SCHEDULED',
  EventStatus.inProgress: 'IN_PROGRESS',
  EventStatus.completed: 'COMPLETED',
  EventStatus.cancelled: 'CANCELLED',
  EventStatus.failed: 'FAILED',
};
