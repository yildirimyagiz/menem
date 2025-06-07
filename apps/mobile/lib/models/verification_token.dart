import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'verification_token.g.dart';

@JsonSerializable()
class VerificationToken extends BaseModel {
  final String userId;
  final String token;

  VerificationToken({
    required super.id,
    required this.userId,
    required this.token,
    required super.createdAt,
    required super.updatedAt,
  });

  factory VerificationToken.fromJson(Map<String, dynamic> json) =>
      _$VerificationTokenFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$VerificationTokenToJson(this);

  bool get isExpired {
    final now = DateTime.now();
    return now.difference(createdAt!).inHours > 24;
  }
}
