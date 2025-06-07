import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'navigation.g.dart';

@JsonSerializable()
class Navigation extends BaseModel {
  final String route;
  final Map<String, dynamic>? params;
  final DateTime? accessedAt;

  Navigation({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.route,
    this.params,
    this.accessedAt,
  });

  factory Navigation.fromJson(Map<String, dynamic> json) => _$NavigationFromJson(json);
  @override
  Map<String, dynamic> toJson() => _$NavigationToJson(this);
}
