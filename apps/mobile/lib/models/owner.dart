import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'owner.g.dart';

@JsonSerializable()
class Owner extends BaseModel {
  final String name;
  final String? email;
  final String? phone;
  final String? avatarUrl;
  final String? responseTime;
  final double? responseRate;
  final DateTime? memberSince;

  Owner({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.name,
    this.email,
    this.phone,
    this.avatarUrl,
    this.responseTime,
    this.responseRate,
    this.memberSince,
  });

  factory Owner.fromJson(Map<String, dynamic> json) => _$OwnerFromJson(json);
  
  @override
  Map<String, dynamic> toJson() => _$OwnerToJson(this);
}
