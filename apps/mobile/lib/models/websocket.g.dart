// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'websocket.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WebSocketModel _$WebSocketModelFromJson(Map<String, dynamic> json) =>
    WebSocketModel(
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
      channel: json['channel'] as String,
      userId: json['userId'] as String?,
      connectedAt: json['connectedAt'] == null
          ? null
          : DateTime.parse(json['connectedAt'] as String),
      disconnectedAt: json['disconnectedAt'] == null
          ? null
          : DateTime.parse(json['disconnectedAt'] as String),
    );

Map<String, dynamic> _$WebSocketModelToJson(WebSocketModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'channel': instance.channel,
      'userId': instance.userId,
      'connectedAt': instance.connectedAt?.toIso8601String(),
      'disconnectedAt': instance.disconnectedAt?.toIso8601String(),
    };
