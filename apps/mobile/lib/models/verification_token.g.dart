// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verification_token.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VerificationToken _$VerificationTokenFromJson(Map<String, dynamic> json) =>
    VerificationToken(
      id: json['id'] as String,
      userId: json['userId'] as String,
      token: json['token'] as String,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$VerificationTokenToJson(VerificationToken instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'userId': instance.userId,
      'token': instance.token,
    };
