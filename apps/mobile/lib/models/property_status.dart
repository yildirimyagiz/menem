class PropertyStatus {
  final String id;
  final String name;
  final String type;
  final bool isActive;
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? deletedAt;

  PropertyStatus({
    required this.id,
    required this.name,
    required this.type,
    required this.isActive,
    this.description,
    required this.createdAt,
    required this.updatedAt,
    this.deletedAt,
  });

  factory PropertyStatus.fromJson(Map<String, dynamic> json) {
    return PropertyStatus(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      isActive: json['isActive'] as bool,
      description: json['description'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      deletedAt: json['deletedAt'] != null
          ? DateTime.parse(json['deletedAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'isActive': isActive,
      'description': description,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'deletedAt': deletedAt?.toIso8601String(),
    };
  }
}
