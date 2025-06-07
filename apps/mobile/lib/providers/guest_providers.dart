import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/guest.dart';
import '../services/guest_service.dart';
import '../api/api_service.dart';

part 'guest_providers.g.dart';

@riverpod
// ignore: deprecated_member_use_from_same_package
GuestService guestService(GuestServiceRef ref) {
  return GuestService(ApiService());
}

@riverpod
class GuestNotifier extends _$GuestNotifier {
  @override
  FutureOr<List<Guest>> build() async {
    final service = ref.read(guestServiceProvider);
    final response = await service.getGuests();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();

    final service = ref.read(guestServiceProvider);
    state = await AsyncValue.guard(() async {
      final response = await service.getGuests();
      return response.data;
    });
  }
  // Add create, update, delete methods as needed
}
