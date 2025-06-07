import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/language.dart';
import '../services/language_service.dart';
import 'api_providers.dart';

part 'language_providers.g.dart';

@riverpod
LanguageService languageService(Ref ref) {
  return LanguageService(ref.watch(apiServiceProvider));
}

@riverpod
class LanguageNotifier extends _$LanguageNotifier {
  late final LanguageService _languageService;

  @override
  Future<List<Language>> build() async {
    _languageService = ref.watch(languageServiceProvider);
    final response = await _languageService.getLanguages();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final response = await _languageService.getLanguages();
      return response.data;
    });
  }

  Future<List<Language>> search(String query) async {
    state = const AsyncValue.loading();
    try {
      final response = await _languageService.getLanguages(
        name: query,
        code: query,
      );
      final languages = response.data;
      state = AsyncValue.data(languages);
      return languages;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<Language> getByCode(String code) async {
    try {
      final response = await _languageService.getLanguages(code: code);
      if (response.data.isEmpty) {
        throw Exception('Language not found with code: $code');
      }
      final language = response.data.first;
      state = AsyncValue.data([language]);
      return language;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<List<Language>> getByName(String name) async {
    try {
      final response = await _languageService.getLanguages(name: name);
      state = AsyncValue.data(response.data);
      return response.data;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<List<Language>> getByNativeName(String nativeName) async {
    try {
      final response = await _languageService.getLanguages(nativeName: nativeName);
      state = AsyncValue.data(response.data);
      return response.data;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<List<Language>> getByIsRTL(bool isRTL) async {
    try {
      final response = await _languageService.getLanguages(isRTL: isRTL);
      state = AsyncValue.data(response.data);
      return response.data;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<List<Language>> getByIsActive(bool isActive) async {
    try {
      final response = await _languageService.getLanguages(isActive: isActive);
      state = AsyncValue.data(response.data);
      return response.data;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<List<Language>> getByAgencyId(String agencyId) async {
    try {
      final response = await _languageService.getLanguages(agencyId: agencyId);
      state = AsyncValue.data(response.data);
      return response.data;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<Language> updateStatus(String languageId, bool isActive) async {
    try {
      state = const AsyncValue.loading();
      final updatedLanguage = await _languageService.updateLanguage(
        id: languageId,
        isActive: isActive,
      );
      
      // Update the state with the updated language
      if (state.hasValue) {
        final languages = List<Language>.from(state.value!);
        final index = languages.indexWhere((lang) => lang.id == languageId);
        if (index != -1) {
          languages[index] = updatedLanguage;
          state = AsyncValue.data(languages);
        }
      }
      
      return updatedLanguage;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

@riverpod
class LanguageDetailNotifier extends _$LanguageDetailNotifier {
  late final LanguageService _languageService;

  @override
  Future<Language?> build(String id) async {
    _languageService = ref.watch(languageServiceProvider);
    try {
      if (id.isEmpty) return null;
      return await _languageService.getLanguage(id);
    } catch (e) {
      // If not found, return null instead of throwing
      if (e.toString().contains('not found') || e is LanguageException) {
        return null;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    final id = state.value?.id;
    if (id == null) return;
    
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _languageService.getLanguage(id));
  }

  Future<Language> updateStatus(bool isActive) async {
    final language = state.value;
    if (language == null) {
      throw StateError('No language loaded to update');
    }
    
    state = const AsyncValue.loading();
    try {
      final updatedLanguage = await _languageService.updateLanguage(
        id: language.id,
        isActive: isActive,
      );
      state = AsyncValue.data(updatedLanguage);
      return updatedLanguage;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}
