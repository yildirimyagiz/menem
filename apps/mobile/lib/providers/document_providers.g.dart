// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'document_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$documentServiceHash() => r'8a9714983cca807f1747e23e1489abf8318e3667';

/// See also [documentService].
@ProviderFor(documentService)
final documentServiceProvider = AutoDisposeProvider<DocumentService>.internal(
  documentService,
  name: r'documentServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$documentServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef DocumentServiceRef = AutoDisposeProviderRef<DocumentService>;
String _$documentNotifierHash() => r'4c7dad5421800c3b5151fb3fe54b0ac2a46dfae4';

/// See also [DocumentNotifier].
@ProviderFor(DocumentNotifier)
final documentNotifierProvider =
    AutoDisposeAsyncNotifierProvider<DocumentNotifier, List<Document>>.internal(
  DocumentNotifier.new,
  name: r'documentNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$documentNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$DocumentNotifier = AutoDisposeAsyncNotifier<List<Document>>;
String _$documentDetailNotifierHash() =>
    r'86894e526fa48b9705e1fc37905859e2efe45908';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

abstract class _$DocumentDetailNotifier
    extends BuildlessAutoDisposeAsyncNotifier<Document> {
  late final String id;

  FutureOr<Document> build(
    String id,
  );
}

/// See also [DocumentDetailNotifier].
@ProviderFor(DocumentDetailNotifier)
const documentDetailNotifierProvider = DocumentDetailNotifierFamily();

/// See also [DocumentDetailNotifier].
class DocumentDetailNotifierFamily extends Family<AsyncValue<Document>> {
  /// See also [DocumentDetailNotifier].
  const DocumentDetailNotifierFamily();

  /// See also [DocumentDetailNotifier].
  DocumentDetailNotifierProvider call(
    String id,
  ) {
    return DocumentDetailNotifierProvider(
      id,
    );
  }

  @override
  DocumentDetailNotifierProvider getProviderOverride(
    covariant DocumentDetailNotifierProvider provider,
  ) {
    return call(
      provider.id,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'documentDetailNotifierProvider';
}

/// See also [DocumentDetailNotifier].
class DocumentDetailNotifierProvider
    extends AutoDisposeAsyncNotifierProviderImpl<DocumentDetailNotifier,
        Document> {
  /// See also [DocumentDetailNotifier].
  DocumentDetailNotifierProvider(
    String id,
  ) : this._internal(
          () => DocumentDetailNotifier()..id = id,
          from: documentDetailNotifierProvider,
          name: r'documentDetailNotifierProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$documentDetailNotifierHash,
          dependencies: DocumentDetailNotifierFamily._dependencies,
          allTransitiveDependencies:
              DocumentDetailNotifierFamily._allTransitiveDependencies,
          id: id,
        );

  DocumentDetailNotifierProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.id,
  }) : super.internal();

  final String id;

  @override
  FutureOr<Document> runNotifierBuild(
    covariant DocumentDetailNotifier notifier,
  ) {
    return notifier.build(
      id,
    );
  }

  @override
  Override overrideWith(DocumentDetailNotifier Function() create) {
    return ProviderOverride(
      origin: this,
      override: DocumentDetailNotifierProvider._internal(
        () => create()..id = id,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        id: id,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<DocumentDetailNotifier, Document>
      createElement() {
    return _DocumentDetailNotifierProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is DocumentDetailNotifierProvider && other.id == id;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, id.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin DocumentDetailNotifierRef
    on AutoDisposeAsyncNotifierProviderRef<Document> {
  /// The parameter `id` of this provider.
  String get id;
}

class _DocumentDetailNotifierProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<DocumentDetailNotifier,
        Document> with DocumentDetailNotifierRef {
  _DocumentDetailNotifierProviderElement(super.provider);

  @override
  String get id => (origin as DocumentDetailNotifierProvider).id;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
