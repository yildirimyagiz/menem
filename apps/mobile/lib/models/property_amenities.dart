import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'property_amenities.g.dart';

enum PropertyAmenityType {
  @JsonValue('POOL')
  pool,
  @JsonValue('GYM')
  gym,
  @JsonValue('GARDEN')
  garden,
  @JsonValue('PARKING')
  parking,
  @JsonValue('SECURITY')
  security,
  @JsonValue('ELEVATOR')
  elevator,
  @JsonValue('STORAGE')
  storage,
  @JsonValue('BALCONY')
  balcony,
  @JsonValue('TERRACE')
  terrace,
  @JsonValue('FURNISHED')
  furnished,
}

@JsonSerializable()
class PropertyAmenities extends BaseModel {
  final String propertyId;
  final PropertyAmenityType type;
  final String? description;
  final bool isIncluded;
  final Map<String, dynamic>? metadata;

  PropertyAmenities({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.propertyId,
    required this.type,
    this.description,
    this.isIncluded = true,
    this.metadata,
  });

  factory PropertyAmenities.fromJson(Map<String, dynamic> json) =>
      _$PropertyAmenitiesFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$PropertyAmenitiesToJson(this);
}
