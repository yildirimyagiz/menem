import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../services/photo_service.dart';
import 'api_service_provider.dart';

part 'photo_providers.g.dart';

@riverpod
PhotoService photoService(Ref ref) {
  return PhotoService(ref.read(apiServiceProvider));
}

@riverpod
class PhotoNotifier extends _$PhotoNotifier {
  @override
  FutureOr<List<dynamic>> build() async {
    final response = await ref.read(photoServiceProvider).getPhotos();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await ref.read(photoServiceProvider).getPhotos();
      return response.data;
    });
  }
}
