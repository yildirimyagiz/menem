import 'dart:async';
import 'package:mobile/providers/analytics_provider.dart';
import 'package:mobile/providers/increase_providers.dart';
import 'package:mobile/providers/mention_providers.dart';
// ignore: implementation_imports, depend_on_referenced_packages
import 'package:riverpod/src/framework.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/analytics.dart';
import '../models/expense.dart';
import '../models/increase.dart';
import '../models/language.dart';
import '../models/mention.dart';

part 'state_providers.g.dart';

@riverpod
class AnalyticsState extends _$AnalyticsState {
  @override
  FutureOr<List<Analytics>> build() async {
    final stats = await ref.watch(analyticsServiceProvider).getDashboardStats();
    return _createAnalyticsFromStats(
        stats, 'dashboard', AnalyticsType.performance);
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final stats =
          await ref.watch(analyticsServiceProvider).getDashboardStats();
      return _createAnalyticsFromStats(
          stats, 'dashboard', AnalyticsType.performance);
    });
  }

  Future<void> getByType(AnalyticsType type) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      Map<String, dynamic> stats;
      switch (type) {
        case AnalyticsType.revenue:
          stats = await ref.watch(analyticsServiceProvider).getRevenueStats({});
          break;
        case AnalyticsType.agencyPerformance:
          stats = await ref.watch(analyticsServiceProvider).getAgentStats('');
          break;
        case AnalyticsType.agentPerformance:
          stats = await ref.watch(analyticsServiceProvider).getAgentStats('');
          break;
        case AnalyticsType.performance:
        default:
          stats = await ref.watch(analyticsServiceProvider).getDashboardStats();
          break;
      }
      return _createAnalyticsFromStats(
          stats, type.toString().split('.').last, type);
    });
  }

  List<Analytics> _createAnalyticsFromStats(
    Map<String, dynamic> stats,
    String entityId,
    AnalyticsType type,
  ) {
    return [
      Analytics(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        entityId: entityId,
        entityType: type.toString().split('.').last,
        type: type,
        data: stats,
        timestamp: DateTime.now(),
      )
    ];
  }
}

@riverpod
class ExpenseState extends _$ExpenseState {
  ProviderListenable? get expenseServiceProvider => null;

  @override
  FutureOr<List<Expense>> build() async {
    return ref.watch(expenseServiceProvider!).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(expenseServiceProvider!).getAll(),
    );
  }

  Future<void> getByStatus(ExpenseStatus status) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(expenseServiceProvider!).getExpensesByStatus(status),
    );
  }
}

@riverpod
class IncreaseState extends _$IncreaseState {
  @override
  FutureOr<List<Increase>> build() async {
    return ref.watch(increaseServiceProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(increaseServiceProvider).getAll(),
    );
  }

  Future<void> getByStatus(IncreaseStatus status) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(increaseServiceProvider).getIncreasesByStatus(status),
    );
  }
}

@riverpod
class LanguageState extends _$LanguageState {
  ProviderListenable? get languageServiceProvider => null;

  @override
  FutureOr<List<Language>> build() async {
    return ref.watch(languageServiceProvider!).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(languageServiceProvider!).getAll(),
    );
  }

  Future<void> getActiveLanguages() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(languageServiceProvider!).getActiveLanguages(),
    );
  }
}

@riverpod
class MentionState extends _$MentionState {
  @override
  FutureOr<List<Mention>> build() async {
    return ref.watch(mentionServiceProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(mentionServiceProvider).getAll(),
    );
  }

  Future<void> getUnreadMentions() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(mentionServiceProvider).getUnreadMentions(),
    );
  }
}
