import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'location.g.dart';

@JsonSerializable()
class Location extends BaseModel {
  final String country;
  final String city;
  final String? district;
  final String address;
  final String? postalCode;
  final Map<String, dynamic>? coordinates;

  Location({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.country,
    required this.city,
    this.district,
    required this.address,
    this.postalCode,
    this.coordinates,
  });

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      id: json['id'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt:
          json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
      country: json['country'],
      city: json['city'],
      district: json['district'],
      address: json['address'],
      postalCode: json['postalCode'],
      coordinates: json['coordinates'],
    );
  }

  get latitude => null;

  get longitude => null;

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      'country': country,
      'city': city,
      'district': district,
      'address': address,
      'postalCode': postalCode,
      'coordinates': coordinates,
    };
  }
}
