// ignore: implementation_imports, depend_on_referenced_packages
import 'package:riverpod/src/framework.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/document.dart';
import '../services/document_service.dart';
import '../utils/trpc_client_adapter.dart';
import 'api_provider.dart';

part 'document_providers.g.dart';

// Provider for DocumentService
@riverpod
DocumentService documentService(Ref ref) {
  final apiService = ref.watch(apiServiceProvider);
  final trpcClient = TrpcClientAdapter(apiService);
  return DocumentService(trpcClient as TrpcClient);
}

@riverpod
class DocumentNotifier extends _$DocumentNotifier {
  @override
  FutureOr<List<Document>> build() async {
    try {
      return await ref.watch(documentServiceProvider).getDocuments();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(documentServiceProvider).getDocuments(),
    );
  }

  Future<void> getByUser(String userId) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(documentServiceProvider).getDocuments(),
    );
  }

  Future<void> createDocument({
    required String title,
    required String description,
    required DocumentType type,
    required DocumentStatus status,
  }) async {
    state = const AsyncValue.loading();
    try {
      await ref.read(documentServiceProvider).createDocument(
        {},
        title: title,
        description: description,
        type: type,
        status: status,
      );
      state = await AsyncValue.guard(
        () => ref.read(documentServiceProvider).getDocuments(),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<void> updateDocument({
    required String id,
    String? title,
    String? description,
    DocumentType? type,
    DocumentStatus? status,
  }) async {
    state = const AsyncValue.loading();
    try {
      await ref.read(documentServiceProvider).updateDocument(
            id,
            title: title,
            description: description,
            type: type,
            status: status,
          );
      state = await AsyncValue.guard(
        () => ref.read(documentServiceProvider).getDocuments(),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<void> updateDocumentStatus(String id, DocumentStatus status) async {
    state = const AsyncValue.loading();
    try {
      await ref.read(documentServiceProvider).updateDocument(
            id,
            status: status,
          );
      state = await AsyncValue.guard(
        () => ref.read(documentServiceProvider).getDocuments(),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<void> deleteDocument(String id) async {
    state = const AsyncValue.loading();
    try {
      await ref.read(documentServiceProvider).deleteDocument(id);
      state = await AsyncValue.guard(
        () => ref.read(documentServiceProvider).getDocuments(),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }
}

@riverpod
class DocumentDetailNotifier extends _$DocumentDetailNotifier {
  @override
  FutureOr<Document> build(String id) async {
    return ref.read(documentServiceProvider).getDocument(id);
  }

  Future<void> refresh() async {
    final id = state.value?.id;
    if (id == null) return;
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(documentServiceProvider).getDocument(id),
    );
  }

  Future<void> updateDocument(Map<String, dynamic> data) async {
    final id = state.value?.id;
    if (id == null) return;
    state = const AsyncValue.loading();
    try {
      await ref.read(documentServiceProvider).updateDocument(
            id,
            title: data['title'] as String?,
            description: data['description'] as String?,
            type: data['type'] as DocumentType?,
            status: data['status'] as DocumentStatus?,
          );
      state = await AsyncValue.guard(
        () => ref.read(documentServiceProvider).getDocument(id),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<void> delete() async {
    final id = state.value?.id;
    if (id == null) return;
    try {
      await ref.read(documentServiceProvider).deleteDocument(id);
      state = const AsyncValue.loading();
      // The widget will be disposed after this, so we don't need to set a value
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }
}
