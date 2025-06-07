import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'property_features.g.dart';

enum PropertyFeatureType {
  @JsonValue('FULLY_FURNISHED')
  fullyFurnished,
  @JsonValue('PARTIALLY_FURNISHED')
  partiallyFurnished,
  @JsonValue('UNFURNISHED')
  unfurnished,
  @JsonValue('OPEN_FLOOR_PLAN')
  openFloorPlan,
  @JsonValue('HIGH_CEILING')
  highCeiling,
  @JsonValue('BALCONY')
  balcony,
  @JsonValue('TERRACE')
  terrace,
  @JsonValue('GARDEN')
  garden,
  @JsonValue('SEA_VIEW')
  seaView,
  @JsonValue('MOUNTAIN_VIEW')
  mountainView,
  @JsonValue('CITY_VIEW')
  cityView,
  @JsonValue('SMART_HOME')
  smartHome,
  @JsonValue('ENERGY_EFFICIENT')
  energyEfficient,
  @JsonValue('SOLAR_PANELS')
  solarPanels,
  @JsonValue('EARTHQUAKE_RESISTANT')
  earthquakeResistant,
  @JsonValue('SOUNDPROOF')
  soundproof,
  @JsonValue('WHEELCHAIR_ACCESSIBLE')
  wheelchairAccessible,
  @JsonValue('PET_FRIENDLY')
  petFriendly,
  @JsonValue('HOME_OFFICE')
  homeOffice,
  @JsonValue('WALK_IN_CLOSET')
  walkInCloset,
}

@JsonSerializable()
class PropertyFeatures extends BaseModel {
  final String propertyId;
  final String name;
  final String description;
  final PropertyFeatureType type;
  final bool isIncluded;
  final Map<String, dynamic>? metadata;

  PropertyFeatures({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.propertyId,
    required this.name,
    required this.description,
    required this.type,
    this.isIncluded = true,
    this.metadata,
  });

  factory PropertyFeatures.fromJson(Map<String, dynamic> json) =>
      _$PropertyFeaturesFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$PropertyFeaturesToJson(this);
}
