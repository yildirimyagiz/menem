import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'photo.g.dart';

@JsonSerializable()
class Photo extends BaseModel {
  final String url;
  final String type;
  final String? caption;
  final String? alt;
  final String? src;
  final bool featured;
  final int? width;
  final int? height;
  final int? fileSize;
  final String? mimeType;
  final String? dominantColor;
  final String? userId;
  final String? agencyId;
  final String? propertyId;
  final String? agentId;
  final String? postId;

  Photo({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.url,
    required this.type,
    this.caption,
    this.alt,
    this.src,
    this.featured = false,
    this.width,
    this.height,
    this.fileSize,
    this.mimeType,
    this.dominantColor,
    this.userId,
    this.agencyId,
    this.propertyId,
    this.agentId,
    this.postId,
  });

  factory Photo.fromJson(Map<String, dynamic> json) => _$PhotoFromJson(json);

  @override
  Map<String, dynamic> toJson() => _$PhotoToJson(this);
}
