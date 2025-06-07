// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Location _$LocationFromJson(Map<String, dynamic> json) => Location(
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
      country: json['country'] as String,
      city: json['city'] as String,
      district: json['district'] as String?,
      address: json['address'] as String,
      postalCode: json['postalCode'] as String?,
      coordinates: json['coordinates'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$LocationToJson(Location instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'country': instance.country,
      'city': instance.city,
      'district': instance.district,
      'address': instance.address,
      'postalCode': instance.postalCode,
      'coordinates': instance.coordinates,
    };
