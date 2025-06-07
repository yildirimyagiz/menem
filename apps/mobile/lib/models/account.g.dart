// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Account _$AccountFromJson(Map<String, dynamic> json) => Account(
      id: json['id'] as String,
      userId: json['userId'] as String,
      type: $enumDecode(_$AccountTypeEnumMap, json['type']),
      provider: json['provider'] as String,
      providerAccountId: json['providerAccountId'] as String,
      refreshToken: json['refresh_token'] as String?,
      accessToken: json['access_token'] as String?,
      expiresAt: (json['expires_at'] as num?)?.toInt(),
      tokenType: json['token_type'] as String?,
      scope: json['scope'] as String?,
      idToken: json['id_token'] as String?,
      sessionState: json['session_state'] as String?,
      user: json['user'] == null
          ? null
          : User.fromJson(json['user'] as Map<String, dynamic>),
      isActive: json['isActive'] as bool,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
    );

Map<String, dynamic> _$AccountToJson(Account instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'isActive': instance.isActive,
      'userId': instance.userId,
      'type': _$AccountTypeEnumMap[instance.type]!,
      'provider': instance.provider,
      'providerAccountId': instance.providerAccountId,
      'refresh_token': instance.refreshToken,
      'access_token': instance.accessToken,
      'expires_at': instance.expiresAt,
      'token_type': instance.tokenType,
      'scope': instance.scope,
      'id_token': instance.idToken,
      'session_state': instance.sessionState,
      'user': instance.user,
    };

const _$AccountTypeEnumMap = {
  AccountType.oauth: 'OAUTH',
  AccountType.email: 'EMAIL',
  AccountType.oidc: 'OIDC',
  AccountType.credentials: 'CREDENTIALS',
  AccountType.google: 'GOOGLE',
  AccountType.facebook: 'FACEBOOK',
};
