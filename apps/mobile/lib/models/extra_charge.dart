import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'extra_charge.g.dart';

@JsonSerializable()
class ExtraCharge extends BaseModel {
  final String name;
  final String? description;
  final String? icon;
  final String? logo;
  final String? facilityId;
  final List<String> propertyIds;
  final List<String> agencyIds;
  final List<String> userIds;
  final List<String> taskIds;
  final List<String> reportIds;
  final List<String> facilityAmenityIds;
  final List<String> locationAmenityIds;
  final List<String> expenseIds;
  final List<String> includedServiceIds;

  ExtraCharge({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    this.description,
    this.icon,
    this.logo,
    this.facilityId,
    this.propertyIds = const [],
    this.agencyIds = const [],
    this.userIds = const [],
    this.taskIds = const [],
    this.reportIds = const [],
    this.facilityAmenityIds = const [],
    this.locationAmenityIds = const [],
    this.expenseIds = const [],
    this.includedServiceIds = const [],
  });

  factory ExtraCharge.fromJson(Map<String, dynamic> json) =>
      _$ExtraChargeFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$ExtraChargeToJson(this);

  copyWith(
      {required String name,
      String? description,
      String? icon,
      String? logo,
      String? facilityId}) {}
}
