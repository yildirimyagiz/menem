// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property_form.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PropertyForm _$PropertyFormFromJson(Map<String, dynamic> json) => PropertyForm(
      (json['size'] as num?)?.toDouble(),
      (json['favoriteCount'] as num?)?.toInt(),
      $enumDecodeNullable(_$ListingTypeEnumMap, json['listingType']),
      json['includedServiceId'] as String?,
      json['extraChargeId'] as String?,
      json['currencyId'] as String?,
      json['guestId'] as String?,
      id: json['id'] as String?,
      title: json['title'] as String,
      description: json['description'] as String?,
      locationId: json['locationId'] as String?,
      price: (json['price'] as num?)?.toDouble(),
      yearBuilt: (json['yearBuilt'] as num?)?.toInt(),
      category: $enumDecode(_$PropertyCategoryEnumMap, json['category']),
      status: $enumDecode(_$PropertyStatusEnumMap, json['status']),
      propertyType: $enumDecode(_$PropertyTypeEnumMap, json['propertyType']),
      condition:
          $enumDecodeNullable(_$PropertyConditionEnumMap, json['condition']),
      features: (json['features'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$PropertyFeaturesEnumMap, e))
          .toList(),
      amenities: (json['amenities'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$PropertyAmenitiesEnumMap, e))
          .toList(),
      listedAt: json['listedAt'] == null
          ? null
          : DateTime.parse(json['listedAt'] as String),
      ownerId: json['ownerId'] as String?,
      agencyId: json['agencyId'] as String?,
      buildingClass:
          $enumDecodeNullable(_$BuildingClassEnumMap, json['buildingClass']),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
    );

Map<String, dynamic> _$PropertyFormToJson(PropertyForm instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'locationId': instance.locationId,
      'price': instance.price,
      'size': instance.size,
      'yearBuilt': instance.yearBuilt,
      'category': _$PropertyCategoryEnumMap[instance.category]!,
      'status': _$PropertyStatusEnumMap[instance.status]!,
      'propertyType': _$PropertyTypeEnumMap[instance.propertyType]!,
      'condition': _$PropertyConditionEnumMap[instance.condition],
      'features':
          instance.features?.map((e) => _$PropertyFeaturesEnumMap[e]!).toList(),
      'amenities': instance.amenities
          ?.map((e) => _$PropertyAmenitiesEnumMap[e]!)
          .toList(),
      'listedAt': instance.listedAt?.toIso8601String(),
      'ownerId': instance.ownerId,
      'agencyId': instance.agencyId,
      'buildingClass': _$BuildingClassEnumMap[instance.buildingClass],
      'listingType': _$ListingTypeEnumMap[instance.listingType],
      'favoriteCount': instance.favoriteCount,
      'includedServiceId': instance.includedServiceId,
      'extraChargeId': instance.extraChargeId,
      'currencyId': instance.currencyId,
      'guestId': instance.guestId,
      'deletedAt': instance.deletedAt?.toIso8601String(),
    };

const _$ListingTypeEnumMap = {
  ListingType.sale: 'SALE',
  ListingType.rent: 'RENT',
  ListingType.booking: 'BOOKING',
};

const _$PropertyCategoryEnumMap = {
  PropertyCategory.residential: 'RESIDENTIAL',
  PropertyCategory.commercial: 'COMMERCIAL',
  PropertyCategory.industrial: 'INDUSTRIAL',
  PropertyCategory.land: 'LAND',
  PropertyCategory.other: 'OTHER',
  PropertyCategory.apartment: 'apartment',
};

const _$PropertyStatusEnumMap = {
  PropertyStatus.available: 'AVAILABLE',
  PropertyStatus.pending: 'PENDING',
  PropertyStatus.sold: 'SOLD',
  PropertyStatus.rented: 'RENTED',
  PropertyStatus.offMarket: 'OFF_MARKET',
  PropertyStatus.underContract: 'underContract',
  PropertyStatus.pendingApproval: 'pendingApproval',
  PropertyStatus.maintenance: 'maintenance',
  PropertyStatus.foreclosure: 'foreclosure',
  PropertyStatus.draft: 'draft',
  PropertyStatus.inactive: 'inactive',
};

const _$PropertyTypeEnumMap = {
  PropertyType.apartment: 'APARTMENT',
  PropertyType.house: 'HOUSE',
  PropertyType.office: 'OFFICE',
  PropertyType.land: 'LAND',
  PropertyType.commercial: 'COMMERCIAL',
  PropertyType.industrial: 'INDUSTRIAL',
  PropertyType.other: 'OTHER',
  PropertyType.residential: 'residential',
};

const _$PropertyConditionEnumMap = {
  PropertyCondition.newConstruction: 'NEW_CONSTRUCTION',
  PropertyCondition.excellent: 'EXCELLENT',
  PropertyCondition.good: 'GOOD',
  PropertyCondition.needsRepair: 'NEEDS_REPAIR',
  PropertyCondition.renovated: 'RENOVATED',
  PropertyCondition.fixerUpper: 'FIXER_UPPER',
};

const _$PropertyFeaturesEnumMap = {
  PropertyFeatures.airConditioning: 'AIR_CONDITIONING',
  PropertyFeatures.balcony: 'BALCONY',
  PropertyFeatures.fireplace: 'FIREPLACE',
  PropertyFeatures.garage: 'GARAGE',
  PropertyFeatures.garden: 'GARDEN',
  PropertyFeatures.pool: 'POOL',
  PropertyFeatures.securitySystem: 'SECURITY_SYSTEM',
  PropertyFeatures.elevator: 'ELEVATOR',
  PropertyFeatures.furnished: 'FURNISHED',
  PropertyFeatures.petsAllowed: 'PETS_ALLOWED',
  PropertyFeatures.attic: 'attic',
  PropertyFeatures.smartHome: 'smartHome',
  PropertyFeatures.basement: 'basement',
  PropertyFeatures.parking: 'parking',
  PropertyFeatures.terrace: 'terrace',
};

const _$PropertyAmenitiesEnumMap = {
  PropertyAmenities.gym: 'GYM',
  PropertyAmenities.parking: 'PARKING',
  PropertyAmenities.security: 'SECURITY',
  PropertyAmenities.swimmingPool: 'SWIMMING_POOL',
  PropertyAmenities.playground: 'PLAYGROUND',
  PropertyAmenities.elevator: 'ELEVATOR',
  PropertyAmenities.airConditioning: 'AIR_CONDITIONING',
  PropertyAmenities.heating: 'HEATING',
  PropertyAmenities.laundry: 'LAUNDRY',
  PropertyAmenities.storage: 'STORAGE',
  PropertyAmenities.spa: 'spa',
  PropertyAmenities.sauna: 'sauna',
  PropertyAmenities.tennisCourt: 'tennisCourt',
  PropertyAmenities.basketballCourt: 'basketballCourt',
  PropertyAmenities.communityCenter: 'communityCenter',
  PropertyAmenities.businessCenter: 'businessCenter',
  PropertyAmenities.conferenceRoom: 'conferenceRoom',
  PropertyAmenities.petFriendly: 'petFriendly',
  PropertyAmenities.wifi: 'wifi',
};

const _$BuildingClassEnumMap = {
  BuildingClass.a: 'A',
  BuildingClass.b: 'B',
  BuildingClass.c: 'C',
  BuildingClass.d: 'D',
};
