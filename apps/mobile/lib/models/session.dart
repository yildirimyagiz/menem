import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'session.g.dart';

@JsonSerializable()
class Session extends BaseModel {
  final String userId;
  final String sessionToken;
  final DateTime expires;
  final String? accessToken;
  final DateTime? lastActivity;
  final String? deviceInfo;
  final String? ipAddress;
  final String? userAgent;
  final bool isValid;

  Session({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.userId,
    required this.sessionToken,
    required this.expires,
    this.accessToken,
    this.lastActivity,
    this.deviceInfo,
    this.ipAddress,
    this.userAgent,
    this.isValid = true,
  });

  factory Session.fromJson(Map<String, dynamic> json) =>
      _$SessionFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$SessionToJson(this);
}
