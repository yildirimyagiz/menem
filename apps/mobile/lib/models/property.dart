// Export enums first
export 'package:mobile/enums/property_enums.dart'
    show
        ListingType,
        PropertyType,
        PropertyStatus,
        PropertyCategory,
        PropertyCondition,
        PropertyFeatures,
        PropertyAmenities,
        BuildingClass,
        EnergyRating,
        OwnershipType,
        OwnershipCategory,
        ContactMethod;

// Then imports
import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/enums/property_enums.dart';
import 'package:mobile/models/base_model.dart';
import 'package:mobile/models/photo.dart';
import 'package:mobile/models/coordinates.dart';
import 'package:mobile/models/review.dart';
import 'package:mobile/models/owner.dart';

part 'property.g.dart';

@JsonSerializable()
class Property extends BaseModel {
  // Identification
  final String propertyNumber;
  final String title;
  final String? description;

  // Enums
  final PropertyType propertyType;
  final PropertyStatus propertyStatus;
  final PropertyCategory category;
  final PropertyCondition? condition;

  // Location
  final String? locationId;
  final String? address;
  final String? city;
  final String? state;
  final String? country;
  final String? zipCode;
  final Coordinates? coordinates;

  // Physical Characteristics
  final double? size;
  final int? bedrooms;
  final int? bathrooms;
  final int? floors;
  final int? yearBuilt;

  // Features & Amenities
  final List<PropertyFeatures>? features;
  final List<PropertyAmenities>? amenities;
  final List<String>? locationAmenities;
  final List<String>? facilityAmenities;
  final int? favoriteCount;
  final ListingType? listingType;
  final List<String>? events;
  final String? includedServiceId;
  final String? extraChargeId;
  final String? currencyId;
  final String? guestId;

  // Technical Details
  final String? constructionType;
  final BuildingClass? buildingClass;
  final EnergyRating? energyRating;
  final int? parkingSpaces;
  final String? parkingType;
  final String? heatingType;
  final String? cancellationPolicy;
  final DateTime? checkInTime;
  final DateTime? checkOutTime;
  final String? specialNotes;
  final String? rules;
  final String? nearbyAttractions;
  final String? transportOptions;
  final String? greenCertification;

  // Ownership & Legal
  final OwnershipType? ownershipType;
  final OwnershipCategory? ownershipCategory;
  final String? titleDeedNumber;
  final DateTime? titleDeedDate;
  final String? facilityId;

  // Financial
  final double? marketValue;
  final double? taxValue;
  final double? insuranceValue;
  final bool? mortgageEligible;

  // Relationships
  final String? agentId;
  final String? ownerId;
  final String? sellerId;
  final String? buyerId;
  final String? agencyId;
  final String? eventId;
  final List<Photo>? photos;
  final List<Review>? reviews;
  final Owner? owner;

  // Contact
  final ContactMethod? contactMethod;
  final String? contactEmail;
  final String? contactPhone;
  @JsonKey(name: 'isActive')
  final bool? _isActive;
  final bool? featured;

  // Metadata
  @JsonKey(name: 'createdAt')
  final DateTime? _createdAt;
  @JsonKey(name: 'updatedAt')
  final DateTime? _updatedAt;
  @JsonKey(name: 'deletedAt')
  final DateTime? _deletedAt;

  double? area;

  @override
  bool get isActive => _isActive ?? true;
  @override
  DateTime? get createdAt => _createdAt;
  @override
  DateTime? get updatedAt => _updatedAt;
  @override
  DateTime? get deletedAt => _deletedAt;

  Property({
    required String id,
    required this.propertyNumber,
    required this.title,
    required this.propertyType,
    required this.propertyStatus,
    required this.category,
    this.size,
    this.favoriteCount = 0,
    this.listingType,
    this.events,
    this.includedServiceId,
    this.extraChargeId,
    this.currencyId,
    this.guestId,
    this.description,
    this.condition,
    this.locationId,
    this.address,
    this.city,
    this.state,
    this.country,
    this.zipCode,
    this.coordinates,
    this.bedrooms,
    this.bathrooms,
    this.floors,
    this.yearBuilt,
    this.features,
    this.amenities,
    this.locationAmenities,
    this.facilityAmenities,
    this.constructionType,
    this.buildingClass,
    this.energyRating,
    this.parkingSpaces,
    this.parkingType,
    this.heatingType,
    this.cancellationPolicy,
    this.checkInTime,
    this.checkOutTime,
    this.specialNotes,
    this.rules,
    this.nearbyAttractions,
    this.transportOptions,
    this.greenCertification,
    this.ownershipType,
    this.ownershipCategory,
    this.titleDeedNumber,
    this.titleDeedDate,
    this.facilityId,
    this.marketValue,
    this.taxValue,
    this.insuranceValue,
    this.mortgageEligible,
    this.agentId,
    this.ownerId,
    this.sellerId,
    this.buyerId,
    this.agencyId,
    this.eventId,
    this.photos,
    this.reviews,
    this.owner,
    this.contactMethod,
    this.contactEmail,
    this.contactPhone,
    bool? isActive,
    this.featured = false,
    this.price,
    this.propertyCategory,
    this.area, // Added area to constructor
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  })  : _isActive = isActive ?? true,
        _createdAt = createdAt,
        _updatedAt = updatedAt,
        _deletedAt = deletedAt,
        super(id: id);

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'] as String? ?? '',
      propertyNumber: json['propertyNumber'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String?,
      propertyType: json['propertyType'] != null
          ? (json['propertyType'] is PropertyType
              ? json['propertyType'] as PropertyType
              : PropertyType.values.firstWhere(
                  (e) => e.toString() == 'PropertyType.${json['propertyType']}',
                  orElse: () => PropertyType.residential))
          : PropertyType.residential,
      propertyStatus: json['propertyStatus'] != null
          ? (json['propertyStatus'] is PropertyStatus
              ? json['propertyStatus'] as PropertyStatus
              : PropertyStatus.values.firstWhere(
                  (e) =>
                      e.toString() ==
                      'PropertyStatus.${json['propertyStatus']}',
                  orElse: () => PropertyStatus.available))
          : PropertyStatus.available,
      category: json['category'] != null
          ? (json['category'] is PropertyCategory
              ? json['category'] as PropertyCategory
              : PropertyCategory.values.firstWhere(
                  (e) => e.toString() == 'PropertyCategory.${json['category']}',
                  orElse: () => PropertyCategory.residential))
          : PropertyCategory.residential,
      size: (json['size'] as num?)?.toDouble(),
      favoriteCount: json['favoriteCount'] as int? ?? 0,
      listingType: json['listingType'] != null
          ? (json['listingType'] is ListingType
              ? json['listingType'] as ListingType
              : ListingType.values.firstWhere(
                  (e) => e.toString() == 'ListingType.${json['listingType']}',
                  orElse: () => ListingType.sale))
          : ListingType.sale,
      condition: json['condition'] != null
          ? (json['condition'] is PropertyCondition
              ? json['condition'] as PropertyCondition
              : PropertyCondition.values.firstWhere(
                  (e) =>
                      e.toString() == 'PropertyCondition.${json['condition']}',
                  orElse: () => PropertyCondition.good))
          : PropertyCondition.good,
      address: json['address'] as String?,
      city: json['city'] as String?,
      state: json['state'] as String?,
      country: json['country'] as String?,
      zipCode: json['zipCode'] as String?,
      price: (json['price'] as num?)?.toDouble(),
      propertyCategory: json['propertyCategory'] != null
          ? (json['propertyCategory'] is PropertyCategory
              ? json['propertyCategory'] as PropertyCategory
              : PropertyCategory.values.firstWhere(
                  (e) =>
                      e.toString() ==
                      'PropertyCategory.${json['propertyCategory']}',
                  orElse: () => PropertyCategory.residential))
          : null,
      isActive: json['isActive'] as bool?,
      createdAt: json['createdAt'] != null
          ? (json['createdAt'] is DateTime
              ? json['createdAt'] as DateTime
              : DateTime.parse(json['createdAt'].toString()))
          : null,
      updatedAt: json['updatedAt'] != null
          ? (json['updatedAt'] is DateTime
              ? json['updatedAt'] as DateTime
              : DateTime.parse(json['updatedAt'].toString()))
          : null,
      deletedAt: json['deletedAt'] != null
          ? (json['deletedAt'] is DateTime
              ? json['deletedAt'] as DateTime
              : DateTime.parse(json['deletedAt'].toString()))
          : null,
    );
  }

  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'propertyNumber': propertyNumber,
      'title': title,
      'description': description,
      'propertyType': propertyType.toString().split('.').last,
      'propertyStatus': propertyStatus.toString().split('.').last,
      'category': category.toString().split('.').last,
      'size': size,
      'favoriteCount': favoriteCount,
      'listingType': listingType?.toString().split('.').last,
      'condition': condition?.toString().split('.').last,
      'address': address,
      'city': city,
      'state': state,
      'country': country,
      'zipCode': zipCode,
      'price': price,
      'propertyCategory': propertyCategory?.toString().split('.').last,
      'isActive': isActive,
      'createdAt': _createdAt?.toIso8601String(),
      'updatedAt': _updatedAt?.toIso8601String(),
      'deletedAt': _deletedAt?.toIso8601String(),
    };
  }

  double? price;
  PropertyCategory? propertyCategory;

  bool isFavorite = false;

  String? get name => null;

  Property copyWith({
    bool? isFavorite,
    int? favoriteCount,
    double? size,
    ListingType? listingType,
    List<String>? events,
    String? includedServiceId,
    String? extraChargeId,
    String? currencyId,
    String? guestId,
    String? id,
    String? propertyNumber,
    String? title,
    String? description,
    PropertyType? propertyType,
    PropertyStatus? propertyStatus,
    PropertyCategory? category,
    PropertyCondition? condition,
    String? locationId,
    String? address,
    String? city,
    String? state,
    String? country,
    String? zipCode,
    Coordinates? coordinates,
    int? bedrooms,
    int? bathrooms,
    int? floors,
    int? yearBuilt,
    List<PropertyFeatures>? features,
    List<PropertyAmenities>? amenities,
    List<String>? locationAmenities,
    List<String>? facilityAmenities,
    String? constructionType,
    BuildingClass? buildingClass,
    EnergyRating? energyRating,
    int? parkingSpaces,
    String? parkingType,
    String? heatingType,
    String? cancellationPolicy,
    DateTime? checkInTime,
    DateTime? checkOutTime,
    String? specialNotes,
    String? rules,
    String? nearbyAttractions,
    String? transportOptions,
    String? greenCertification,
    OwnershipType? ownershipType,
    OwnershipCategory? ownershipCategory,
    String? titleDeedNumber,
    DateTime? titleDeedDate,
    String? facilityId,
    double? marketValue,
    double? taxValue,
    double? insuranceValue,
    bool? mortgageEligible,
    String? agentId,
    String? ownerId,
    String? sellerId,
    String? buyerId,
    String? agencyId,
    String? eventId,
    List<Photo>? photos,
    List<Review>? reviews,
    Owner? owner,
    ContactMethod? contactMethod,
    String? contactEmail,
    String? contactPhone,
    bool? isActive,
    bool? featured,
    double? price,
    PropertyCategory? propertyCategory,
    DateTime? deletedAt,
  }) {
    final newProperty = Property(
      size: size ?? this.size,
      favoriteCount: favoriteCount ?? this.favoriteCount,
      listingType: listingType ?? this.listingType,
      events: events ?? this.events,
      includedServiceId: includedServiceId ?? this.includedServiceId,
      extraChargeId: extraChargeId ?? this.extraChargeId,
      currencyId: currencyId ?? this.currencyId,
      guestId: guestId ?? this.guestId,
      id: id ?? this.id,
      propertyNumber: propertyNumber ?? this.propertyNumber,
      title: title ?? this.title,
      description: description ?? this.description,
      propertyType: propertyType ?? this.propertyType,
      propertyStatus: propertyStatus ?? this.propertyStatus,
      category: category ?? this.category,
      condition: condition ?? this.condition,
      locationId: locationId ?? this.locationId,
      address: address ?? this.address,
      city: city ?? this.city,
      state: state ?? this.state,
      country: country ?? this.country,
      zipCode: zipCode ?? this.zipCode,
      coordinates: coordinates ?? this.coordinates,
      bedrooms: bedrooms ?? this.bedrooms,
      bathrooms: bathrooms ?? this.bathrooms,
      floors: floors ?? this.floors,
      yearBuilt: yearBuilt ?? this.yearBuilt,
      features: features ?? this.features,
      amenities: amenities ?? this.amenities,
      locationAmenities: locationAmenities ?? this.locationAmenities,
      facilityAmenities: facilityAmenities ?? this.facilityAmenities,
      constructionType: constructionType ?? this.constructionType,
      buildingClass: buildingClass ?? this.buildingClass,
      energyRating: energyRating ?? this.energyRating,
      parkingSpaces: parkingSpaces ?? this.parkingSpaces,
      parkingType: parkingType ?? this.parkingType,
      heatingType: heatingType ?? this.heatingType,
      cancellationPolicy: cancellationPolicy ?? this.cancellationPolicy,
      checkInTime: checkInTime ?? this.checkInTime,
      checkOutTime: checkOutTime ?? this.checkOutTime,
      specialNotes: specialNotes ?? this.specialNotes,
      rules: rules ?? this.rules,
      nearbyAttractions: nearbyAttractions ?? this.nearbyAttractions,
      transportOptions: transportOptions ?? this.transportOptions,
      greenCertification: greenCertification ?? this.greenCertification,
      ownershipType: ownershipType ?? this.ownershipType,
      ownershipCategory: ownershipCategory ?? this.ownershipCategory,
      titleDeedNumber: titleDeedNumber ?? this.titleDeedNumber,
      titleDeedDate: titleDeedDate ?? this.titleDeedDate,
      facilityId: facilityId ?? this.facilityId,
      marketValue: marketValue ?? this.marketValue,
      taxValue: taxValue ?? this.taxValue,
      insuranceValue: insuranceValue ?? this.insuranceValue,
      mortgageEligible: mortgageEligible ?? this.mortgageEligible,
      agentId: agentId ?? this.agentId,
      ownerId: ownerId ?? this.ownerId,
      sellerId: sellerId ?? this.sellerId,
      buyerId: buyerId ?? this.buyerId,
      agencyId: agencyId ?? this.agencyId,
      eventId: eventId ?? this.eventId,
      photos: photos ?? this.photos,
      reviews: reviews ?? this.reviews,
      owner: owner ?? this.owner,
      contactMethod: contactMethod ?? this.contactMethod,
      contactEmail: contactEmail ?? this.contactEmail,
      contactPhone: contactPhone ?? this.contactPhone,
      isActive: isActive ?? _isActive,
      featured: featured ?? this.featured,
      price: price ?? this.price,
      propertyCategory: propertyCategory ?? this.propertyCategory,
    );

    // Copy non-final fields
    newProperty.isFavorite = isFavorite ?? this.isFavorite;
    newProperty.price = price ?? this.price;
    newProperty.propertyCategory = propertyCategory ?? this.propertyCategory;

    return newProperty;
  }
}
