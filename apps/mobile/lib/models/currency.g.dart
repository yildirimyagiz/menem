// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'currency.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Currency _$CurrencyFromJson(Map<String, dynamic> json) => Currency(
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
      symbol: json['symbol'] as String,
      decimals: (json['decimals'] as num).toInt(),
      country: json['country'] as String?,
      isDefault: json['isDefault'] as bool? ?? false,
      isActive: json['isActive'] as bool? ?? true,
      exchangeRate: (json['exchangeRate'] as num?)?.toDouble(),
      rateUpdatedAt: json['rateUpdatedAt'] == null
          ? null
          : DateTime.parse(json['rateUpdatedAt'] as String),
    );

Map<String, dynamic> _$CurrencyToJson(Currency instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'code': instance.code,
      'name': instance.name,
      'symbol': instance.symbol,
      'decimals': instance.decimals,
      'country': instance.country,
      'isDefault': instance.isDefault,
      'isActive': instance.isActive,
      'exchangeRate': instance.exchangeRate,
      'rateUpdatedAt': instance.rateUpdatedAt?.toIso8601String(),
    };
