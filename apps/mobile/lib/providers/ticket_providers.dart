import 'package:mobile/providers/api_service_provider.dart';
import 'package:mobile/services/ticket_service.dart';
// ignore: implementation_imports, depend_on_referenced_packages
import 'package:riverpod/src/framework.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/ticket.dart';

part 'ticket_providers.g.dart';

@riverpod
class TicketNotifier extends _$TicketNotifier {
  @override
  FutureOr<List<Ticket>> build() async {
    return ref
        .read(
            TicketService(ref.watch(apiServiceProvider)) as ProviderListenable)
        .getAll();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ref
        .read(
            TicketService(ref.watch(apiServiceProvider)) as ProviderListenable)
        .getAll());
  }

  Future<void> getByUser(String userId) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ref
        .read(
            TicketService(ref.watch(apiServiceProvider)) as ProviderListenable)
        .getTicketsByUser(userId));
  }

  Future<void> getByStatus(TicketStatus status) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ref
        .read(
            TicketService(ref.watch(apiServiceProvider)) as ProviderListenable)
        .getTicketsByStatus(status as String));
  }
}

@riverpod
class TicketDetailNotifier extends _$TicketDetailNotifier {
  @override
  FutureOr<Ticket?> build(String id) async {
    return ref
        .read(
            TicketService(ref.watch(apiServiceProvider)) as ProviderListenable)
        .get(id);
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ref
        .read(
            TicketService(ref.watch(apiServiceProvider)) as ProviderListenable)
        .get(state.value?.id ?? ''));
  }
}
