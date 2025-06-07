// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Property _$PropertyFromJson(Map<String, dynamic> json) => Property(
      id: json['id'] as String,
      propertyNumber: json['propertyNumber'] as String,
      title: json['title'] as String,
      propertyType: $enumDecode(_$PropertyTypeEnumMap, json['propertyType']),
      propertyStatus:
          $enumDecode(_$PropertyStatusEnumMap, json['propertyStatus']),
      category: $enumDecode(_$PropertyCategoryEnumMap, json['category']),
      size: (json['size'] as num?)?.toDouble(),
      favoriteCount: (json['favoriteCount'] as num?)?.toInt() ?? 0,
      listingType:
          $enumDecodeNullable(_$ListingTypeEnumMap, json['listingType']),
      events:
          (json['events'] as List<dynamic>?)?.map((e) => e as String).toList(),
      includedServiceId: json['includedServiceId'] as String?,
      extraChargeId: json['extraChargeId'] as String?,
      currencyId: json['currencyId'] as String?,
      guestId: json['guestId'] as String?,
      description: json['description'] as String?,
      condition:
          $enumDecodeNullable(_$PropertyConditionEnumMap, json['condition']),
      locationId: json['locationId'] as String?,
      address: json['address'] as String?,
      city: json['city'] as String?,
      state: json['state'] as String?,
      country: json['country'] as String?,
      zipCode: json['zipCode'] as String?,
      coordinates: json['coordinates'] == null
          ? null
          : Coordinates.fromJson(json['coordinates'] as Map<String, dynamic>),
      bedrooms: (json['bedrooms'] as num?)?.toInt(),
      bathrooms: (json['bathrooms'] as num?)?.toInt(),
      floors: (json['floors'] as num?)?.toInt(),
      yearBuilt: (json['yearBuilt'] as num?)?.toInt(),
      features: (json['features'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$PropertyFeaturesEnumMap, e))
          .toList(),
      amenities: (json['amenities'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$PropertyAmenitiesEnumMap, e))
          .toList(),
      locationAmenities: (json['locationAmenities'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      facilityAmenities: (json['facilityAmenities'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      constructionType: json['constructionType'] as String?,
      buildingClass:
          $enumDecodeNullable(_$BuildingClassEnumMap, json['buildingClass']),
      energyRating:
          $enumDecodeNullable(_$EnergyRatingEnumMap, json['energyRating']),
      parkingSpaces: (json['parkingSpaces'] as num?)?.toInt(),
      parkingType: json['parkingType'] as String?,
      heatingType: json['heatingType'] as String?,
      cancellationPolicy: json['cancellationPolicy'] as String?,
      checkInTime: json['checkInTime'] == null
          ? null
          : DateTime.parse(json['checkInTime'] as String),
      checkOutTime: json['checkOutTime'] == null
          ? null
          : DateTime.parse(json['checkOutTime'] as String),
      specialNotes: json['specialNotes'] as String?,
      rules: json['rules'] as String?,
      nearbyAttractions: json['nearbyAttractions'] as String?,
      transportOptions: json['transportOptions'] as String?,
      greenCertification: json['greenCertification'] as String?,
      ownershipType:
          $enumDecodeNullable(_$OwnershipTypeEnumMap, json['ownershipType']),
      ownershipCategory: $enumDecodeNullable(
          _$OwnershipCategoryEnumMap, json['ownershipCategory']),
      titleDeedNumber: json['titleDeedNumber'] as String?,
      titleDeedDate: json['titleDeedDate'] == null
          ? null
          : DateTime.parse(json['titleDeedDate'] as String),
      facilityId: json['facilityId'] as String?,
      marketValue: (json['marketValue'] as num?)?.toDouble(),
      taxValue: (json['taxValue'] as num?)?.toDouble(),
      insuranceValue: (json['insuranceValue'] as num?)?.toDouble(),
      mortgageEligible: json['mortgageEligible'] as bool?,
      agentId: json['agentId'] as String?,
      ownerId: json['ownerId'] as String?,
      sellerId: json['sellerId'] as String?,
      buyerId: json['buyerId'] as String?,
      agencyId: json['agencyId'] as String?,
      eventId: json['eventId'] as String?,
      photos: (json['photos'] as List<dynamic>?)
          ?.map((e) => Photo.fromJson(e as Map<String, dynamic>))
          .toList(),
      reviews: (json['reviews'] as List<dynamic>?)
          ?.map((e) => Review.fromJson(e as Map<String, dynamic>))
          .toList(),
      owner: json['owner'] == null
          ? null
          : Owner.fromJson(json['owner'] as Map<String, dynamic>),
      contactMethod:
          $enumDecodeNullable(_$ContactMethodEnumMap, json['contactMethod']),
      contactEmail: json['contactEmail'] as String?,
      contactPhone: json['contactPhone'] as String?,
      isActive: json['isActive'] as bool?,
      featured: json['featured'] as bool? ?? false,
      price: (json['price'] as num?)?.toDouble(),
      propertyCategory: $enumDecodeNullable(
          _$PropertyCategoryEnumMap, json['propertyCategory']),
      area: (json['area'] as num?)?.toDouble(),
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
    )..isFavorite = json['isFavorite'] as bool;

Map<String, dynamic> _$PropertyToJson(Property instance) => <String, dynamic>{
      'id': instance.id,
      'propertyNumber': instance.propertyNumber,
      'title': instance.title,
      'description': instance.description,
      'propertyType': _$PropertyTypeEnumMap[instance.propertyType]!,
      'propertyStatus': _$PropertyStatusEnumMap[instance.propertyStatus]!,
      'category': _$PropertyCategoryEnumMap[instance.category]!,
      'condition': _$PropertyConditionEnumMap[instance.condition],
      'locationId': instance.locationId,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
      'zipCode': instance.zipCode,
      'coordinates': instance.coordinates,
      'size': instance.size,
      'bedrooms': instance.bedrooms,
      'bathrooms': instance.bathrooms,
      'floors': instance.floors,
      'yearBuilt': instance.yearBuilt,
      'features':
          instance.features?.map((e) => _$PropertyFeaturesEnumMap[e]!).toList(),
      'amenities': instance.amenities
          ?.map((e) => _$PropertyAmenitiesEnumMap[e]!)
          .toList(),
      'locationAmenities': instance.locationAmenities,
      'facilityAmenities': instance.facilityAmenities,
      'favoriteCount': instance.favoriteCount,
      'listingType': _$ListingTypeEnumMap[instance.listingType],
      'events': instance.events,
      'includedServiceId': instance.includedServiceId,
      'extraChargeId': instance.extraChargeId,
      'currencyId': instance.currencyId,
      'guestId': instance.guestId,
      'constructionType': instance.constructionType,
      'buildingClass': _$BuildingClassEnumMap[instance.buildingClass],
      'energyRating': _$EnergyRatingEnumMap[instance.energyRating],
      'parkingSpaces': instance.parkingSpaces,
      'parkingType': instance.parkingType,
      'heatingType': instance.heatingType,
      'cancellationPolicy': instance.cancellationPolicy,
      'checkInTime': instance.checkInTime?.toIso8601String(),
      'checkOutTime': instance.checkOutTime?.toIso8601String(),
      'specialNotes': instance.specialNotes,
      'rules': instance.rules,
      'nearbyAttractions': instance.nearbyAttractions,
      'transportOptions': instance.transportOptions,
      'greenCertification': instance.greenCertification,
      'ownershipType': _$OwnershipTypeEnumMap[instance.ownershipType],
      'ownershipCategory':
          _$OwnershipCategoryEnumMap[instance.ownershipCategory],
      'titleDeedNumber': instance.titleDeedNumber,
      'titleDeedDate': instance.titleDeedDate?.toIso8601String(),
      'facilityId': instance.facilityId,
      'marketValue': instance.marketValue,
      'taxValue': instance.taxValue,
      'insuranceValue': instance.insuranceValue,
      'mortgageEligible': instance.mortgageEligible,
      'agentId': instance.agentId,
      'ownerId': instance.ownerId,
      'sellerId': instance.sellerId,
      'buyerId': instance.buyerId,
      'agencyId': instance.agencyId,
      'eventId': instance.eventId,
      'photos': instance.photos,
      'reviews': instance.reviews,
      'owner': instance.owner,
      'contactMethod': _$ContactMethodEnumMap[instance.contactMethod],
      'contactEmail': instance.contactEmail,
      'contactPhone': instance.contactPhone,
      'featured': instance.featured,
      'area': instance.area,
      'isActive': instance.isActive,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'price': instance.price,
      'propertyCategory': _$PropertyCategoryEnumMap[instance.propertyCategory],
      'isFavorite': instance.isFavorite,
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

const _$PropertyCategoryEnumMap = {
  PropertyCategory.residential: 'RESIDENTIAL',
  PropertyCategory.commercial: 'COMMERCIAL',
  PropertyCategory.industrial: 'INDUSTRIAL',
  PropertyCategory.land: 'LAND',
  PropertyCategory.other: 'OTHER',
  PropertyCategory.apartment: 'apartment',
};

const _$ListingTypeEnumMap = {
  ListingType.sale: 'SALE',
  ListingType.rent: 'RENT',
  ListingType.booking: 'BOOKING',
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

const _$EnergyRatingEnumMap = {
  EnergyRating.a: 'A',
  EnergyRating.b: 'B',
  EnergyRating.c: 'C',
  EnergyRating.d: 'D',
  EnergyRating.e: 'E',
  EnergyRating.f: 'F',
  EnergyRating.g: 'G',
};

const _$OwnershipTypeEnumMap = {
  OwnershipType.freehold: 'FREEHOLD',
  OwnershipType.leasehold: 'LEASEHOLD',
  OwnershipType.strata: 'STRATA',
  OwnershipType.crossLease: 'CROSS_LEASE',
  OwnershipType.companyShare: 'COMPANY_SHARE',
  OwnershipType.other: 'OTHER',
};

const _$OwnershipCategoryEnumMap = {
  OwnershipCategory.freehold: 'FREEHOLD',
  OwnershipCategory.leasehold: 'LEASEHOLD',
  OwnershipCategory.strata: 'STRATA',
  OwnershipCategory.crossLease: 'CROSS_LEASE',
  OwnershipCategory.companyShare: 'COMPANY_SHARE',
  OwnershipCategory.other: 'OTHER',
};

const _$ContactMethodEnumMap = {
  ContactMethod.phone: 'PHONE',
  ContactMethod.email: 'EMAIL',
  ContactMethod.sms: 'SMS',
  ContactMethod.whatsapp: 'WHATSAPP',
  ContactMethod.other: 'OTHER',
};
