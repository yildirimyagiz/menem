import 'package:json_annotation/json_annotation.dart';
import 'base_model.dart';

part 'websocket.g.dart';

@JsonSerializable()
class WebSocketModel extends BaseModel {
  final String channel;
  final String? userId;
  final DateTime? connectedAt;
  final DateTime? disconnectedAt;

  WebSocketModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    super.deletedAt,
    required this.channel,
    this.userId,
    this.connectedAt,
    this.disconnectedAt,
  });

  factory WebSocketModel.fromJson(Map<String, dynamic> json) => _$WebSocketModelFromJson(json);
  @override
  Map<String, dynamic> toJson() => _$WebSocketModelToJson(this);
}
