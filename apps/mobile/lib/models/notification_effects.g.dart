// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification_effects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NotificationEffects _$NotificationEffectsFromJson(Map<String, dynamic> json) =>
    NotificationEffects(
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
      notificationId: json['notificationId'] as String,
      effectType: json['effectType'] as String,
      details: json['details'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$NotificationEffectsToJson(
        NotificationEffects instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'notificationId': instance.notificationId,
      'effectType': instance.effectType,
      'details': instance.details,
    };
