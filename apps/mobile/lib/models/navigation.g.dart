// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'navigation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Navigation _$NavigationFromJson(Map<String, dynamic> json) => Navigation(
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
      route: json['route'] as String,
      params: json['params'] as Map<String, dynamic>?,
      accessedAt: json['accessedAt'] == null
          ? null
          : DateTime.parse(json['accessedAt'] as String),
    );

Map<String, dynamic> _$NavigationToJson(Navigation instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'route': instance.route,
      'params': instance.params,
      'accessedAt': instance.accessedAt?.toIso8601String(),
    };
