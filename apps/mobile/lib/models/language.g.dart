// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'language.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Language _$LanguageFromJson(Map<String, dynamic> json) => Language(
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
      code: json['code'] as String,
      name: json['name'] as String,
      nativeName: json['nativeName'] as String,
      status: $enumDecode(_$LanguageStatusEnumMap, json['status']),
      isDefault: json['isDefault'] as bool,
      isRtl: json['isRtl'] as bool,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$LanguageToJson(Language instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'code': instance.code,
      'name': instance.name,
      'nativeName': instance.nativeName,
      'status': _$LanguageStatusEnumMap[instance.status]!,
      'isDefault': instance.isDefault,
      'isRtl': instance.isRtl,
      'metadata': instance.metadata,
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$LanguageStatusEnumMap = {
  LanguageStatus.active: 'ACTIVE',
  LanguageStatus.inactive: 'INACTIVE',
};
