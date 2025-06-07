class PropertyType {
  final String id;
  final String name;
  final String category;
  final bool isActive;
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? deletedAt;

  PropertyType({
    required this.id,
    required this.name,
    required this.category,
    required this.isActive,
    this.description,
    required this.createdAt,
    required this.updatedAt,
    this.deletedAt,
  });

  factory PropertyType.fromJson(Map<String, dynamic> json) {
    return PropertyType(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
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
      'category': category,
      'isActive': isActive,
      'description': description,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'deletedAt': deletedAt?.toIso8601String(),
    };
  }
}
