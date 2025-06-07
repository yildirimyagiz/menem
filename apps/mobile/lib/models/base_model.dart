import 'package:json_annotation/json_annotation.dart';

part 'base_model.g.dart';

@JsonSerializable()
class BaseModel {
  final String id;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? deletedAt;

  const BaseModel({
    required this.id,
    this.createdAt,
    this.updatedAt,
    this.deletedAt,
  });

  factory BaseModel.fromJson(Map<String, dynamic> json) =>
      _$BaseModelFromJson(json);
  Map<String, dynamic> toJson() => _$BaseModelToJson(this);

  bool get isDeleted => deletedAt != null;
  bool get isActive => !isDeleted;
}
