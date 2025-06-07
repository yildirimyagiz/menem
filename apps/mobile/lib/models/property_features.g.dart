// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property_features.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PropertyFeatures _$PropertyFeaturesFromJson(Map<String, dynamic> json) =>
    PropertyFeatures(
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
      propertyId: json['propertyId'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$PropertyFeatureTypeEnumMap, json['type']),
      isIncluded: json['isIncluded'] as bool? ?? true,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$PropertyFeaturesToJson(PropertyFeatures instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'propertyId': instance.propertyId,
      'name': instance.name,
      'description': instance.description,
      'type': _$PropertyFeatureTypeEnumMap[instance.type]!,
      'isIncluded': instance.isIncluded,
      'metadata': instance.metadata,
    };

const _$PropertyFeatureTypeEnumMap = {
  PropertyFeatureType.fullyFurnished: 'FULLY_FURNISHED',
  PropertyFeatureType.partiallyFurnished: 'PARTIALLY_FURNISHED',
  PropertyFeatureType.unfurnished: 'UNFURNISHED',
  PropertyFeatureType.openFloorPlan: 'OPEN_FLOOR_PLAN',
  PropertyFeatureType.highCeiling: 'HIGH_CEILING',
  PropertyFeatureType.balcony: 'BALCONY',
  PropertyFeatureType.terrace: 'TERRACE',
  PropertyFeatureType.garden: 'GARDEN',
  PropertyFeatureType.seaView: 'SEA_VIEW',
  PropertyFeatureType.mountainView: 'MOUNTAIN_VIEW',
  PropertyFeatureType.cityView: 'CITY_VIEW',
  PropertyFeatureType.smartHome: 'SMART_HOME',
  PropertyFeatureType.energyEfficient: 'ENERGY_EFFICIENT',
  PropertyFeatureType.solarPanels: 'SOLAR_PANELS',
  PropertyFeatureType.earthquakeResistant: 'EARTHQUAKE_RESISTANT',
  PropertyFeatureType.soundproof: 'SOUNDPROOF',
  PropertyFeatureType.wheelchairAccessible: 'WHEELCHAIR_ACCESSIBLE',
  PropertyFeatureType.petFriendly: 'PET_FRIENDLY',
  PropertyFeatureType.homeOffice: 'HOME_OFFICE',
  PropertyFeatureType.walkInCloset: 'WALK_IN_CLOSET',
};
