// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Notification _$NotificationFromJson(Map<String, dynamic> json) => Notification(
      id: json['id'] as String,
      title: json['title'] as String,
      message: json['message'] as String,
      type: $enumDecode(_$NotificationTypeEnumMap, json['type']),
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      isRead: json['isRead'] as bool? ?? false,
      metadata: json['metadata'] as Map<String, dynamic>?,
    )
      ..entityId = json['entityId'] as String?
      ..content = json['content'] as String?
      ..entityType = json['entityType'] as String?
      ..agencyId = json['agencyId'] as String?
      ..agentId = json['agentId'] as String?
      ..tenantId = json['tenantId'] as String?
      ..reviewId = json['reviewId'] as String?
      ..agency = json['agency'] as Map<String, dynamic>?
      ..agent = json['agent'] as Map<String, dynamic>?
      ..tenant = json['tenant'] as Map<String, dynamic>?
      ..review = json['review'] as Map<String, dynamic>?
      ..user = json['user'] as Map<String, dynamic>?;

Map<String, dynamic> _$NotificationToJson(Notification instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'title': instance.title,
      'message': instance.message,
      'type': _$NotificationTypeEnumMap[instance.type]!,
      'isRead': instance.isRead,
      'metadata': instance.metadata,
      'entityId': instance.entityId,
      'content': instance.content,
      'entityType': instance.entityType,
      'agencyId': instance.agencyId,
      'agentId': instance.agentId,
      'tenantId': instance.tenantId,
      'reviewId': instance.reviewId,
      'agency': instance.agency,
      'agent': instance.agent,
      'tenant': instance.tenant,
      'review': instance.review,
      'user': instance.user,
    };

const _$NotificationTypeEnumMap = {
  NotificationType.message: 'message',
  NotificationType.listing: 'listing',
  NotificationType.system: 'system',
  NotificationType.warning: 'warning',
  NotificationType.booking: 'booking',
  NotificationType.mention: 'mention',
  NotificationType.like: 'like',
  NotificationType.comment: 'comment',
  NotificationType.follow: 'follow',
  NotificationType.price: 'price',
  NotificationType.availability: 'availability',
  NotificationType.other: 'other',
  NotificationType.priceChange: 'priceChange',
};
