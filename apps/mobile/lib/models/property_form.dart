import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/enums/property_enums.dart' as enums;
import 'property.dart';

part 'property_form.g.dart';

@JsonSerializable()
class PropertyForm {
  final String? id; // Only for updates
  final String title;
  final String? description;
  final String? locationId;
  final double? price;
  final double? size;
  final int? yearBuilt;
  final enums.PropertyCategory category;
  final enums.PropertyStatus status;
  final enums.PropertyType propertyType;
  final enums.PropertyCondition? condition;
  final List<enums.PropertyFeatures>? features;
  final List<enums.PropertyAmenities>? amenities;
  final DateTime? listedAt;
  final String? ownerId;
  final String? agencyId;
  final enums.BuildingClass? buildingClass;
  final enums.ListingType? listingType;
  final int? favoriteCount;
  final String? includedServiceId;
  final String? extraChargeId;
  final String? currencyId;
  final String? guestId;
  final DateTime? deletedAt;

  PropertyForm(
    this.size,
    this.favoriteCount,
    this.listingType,
    this.includedServiceId,
    this.extraChargeId,
    this.currencyId,
    this.guestId, {
    this.id,
    required this.title,
    this.description,
    this.locationId,
    this.price,
    this.yearBuilt,
    required this.category,
    required this.status,
    required this.propertyType,
    this.condition,
    this.features,
    this.amenities,
    this.listedAt,
    this.ownerId,
    this.agencyId,
    this.buildingClass,
    this.deletedAt,
  });

  factory PropertyForm.fromJson(Map<String, dynamic> json) =>
      _$PropertyFormFromJson(json);

  Map<String, dynamic> toJson() => _$PropertyFormToJson(this);

  PropertyForm copyWith({
    double? size,
    int? favoriteCount,
    enums.ListingType? listingType,
    String? includedServiceId,
    String? extraChargeId,
    String? currencyId,
    String? guestId,
    String? id,
    String? title,
    String? description,
    String? locationId,
    double? price,
    int? yearBuilt,
    PropertyCategory? category,
    enums.PropertyStatus? status,
    enums.PropertyType? propertyType,
    PropertyCondition? condition,
    List<PropertyFeatures>? features,
    List<PropertyAmenities>? amenities,
    DateTime? listedAt,
    String? ownerId,
    String? agencyId,
    BuildingClass? buildingClass,
    DateTime? deletedAt,
  }) {
    return PropertyForm(
      size ?? this.size,
      favoriteCount ?? this.favoriteCount,
      listingType ?? this.listingType,
      includedServiceId ?? this.includedServiceId,
      extraChargeId ?? this.extraChargeId,
      currencyId ?? this.currencyId,
      guestId ?? this.guestId,
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      locationId: locationId ?? this.locationId,
      price: price ?? this.price,
      yearBuilt: yearBuilt ?? this.yearBuilt,
      category: category ?? this.category,
      status: status ?? this.status,
      propertyType: propertyType ?? this.propertyType,
      condition: condition ?? this.condition,
      features: features ?? this.features,
      amenities: amenities ?? this.amenities,
      listedAt: listedAt ?? this.listedAt,
      ownerId: ownerId ?? this.ownerId,
      agencyId: agencyId ?? this.agencyId,
      buildingClass: buildingClass ?? this.buildingClass,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }
}
