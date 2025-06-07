import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'notification_effects.g.dart';

@JsonSerializable()
class NotificationEffects extends BaseModel {
  final String notificationId;
  final String effectType;
  final Map<String, dynamic>? details;

  NotificationEffects({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.notificationId,
    required this.effectType,
    this.details,
  });

  factory NotificationEffects.fromJson(Map<String, dynamic> json) => _$NotificationEffectsFromJson(json);
  @override
  Map<String, dynamic> toJson() => _$NotificationEffectsToJson(this);
}
