// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'session.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Session _$SessionFromJson(Map<String, dynamic> json) => Session(
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
      userId: json['userId'] as String,
      sessionToken: json['sessionToken'] as String,
      expires: DateTime.parse(json['expires'] as String),
      accessToken: json['accessToken'] as String?,
      lastActivity: json['lastActivity'] == null
          ? null
          : DateTime.parse(json['lastActivity'] as String),
      deviceInfo: json['deviceInfo'] as String?,
      ipAddress: json['ipAddress'] as String?,
      userAgent: json['userAgent'] as String?,
      isValid: json['isValid'] as bool? ?? true,
    );

Map<String, dynamic> _$SessionToJson(Session instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'userId': instance.userId,
      'sessionToken': instance.sessionToken,
      'expires': instance.expires.toIso8601String(),
      'accessToken': instance.accessToken,
      'lastActivity': instance.lastActivity?.toIso8601String(),
      'deviceInfo': instance.deviceInfo,
      'ipAddress': instance.ipAddress,
      'userAgent': instance.userAgent,
      'isValid': instance.isValid,
    };
