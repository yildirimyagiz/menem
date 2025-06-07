import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'settings_provider.g.dart';

class AppSettings {
  final bool isDarkMode;
  final bool notificationsEnabled;
  final String language;

  const AppSettings({
    required this.isDarkMode,
    required this.notificationsEnabled,
    required this.language,
  });

  AppSettings copyWith({
    bool? isDarkMode,
    bool? notificationsEnabled,
    String? language,
  }) {
    return AppSettings(
      isDarkMode: isDarkMode ?? this.isDarkMode,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      language: language ?? this.language,
    );
  }
}

@riverpod
class SettingsNotifier extends _$SettingsNotifier {
  static const _darkModeKey = 'dark_mode';
  static const _notificationsKey = 'notifications';
  static const _languageKey = 'language';

  @override
  AppSettings build() {
    // Initial state; will be replaced by _loadSettings
    _loadSettings();
    return const AppSettings(
      isDarkMode: false,
      notificationsEnabled: true,
      language: 'en',
    );
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    state = AppSettings(
      isDarkMode: prefs.getBool(_darkModeKey) ?? false,
      notificationsEnabled: prefs.getBool(_notificationsKey) ?? true,
      language: prefs.getString(_languageKey) ?? 'en',
    );
  }

  Future<void> toggleDarkMode() async {
    final prefs = await SharedPreferences.getInstance();
    final newValue = !state.isDarkMode;
    await prefs.setBool(_darkModeKey, newValue);
    state = state.copyWith(isDarkMode: newValue);
  }

  Future<void> toggleNotifications() async {
    final prefs = await SharedPreferences.getInstance();
    final newValue = !state.notificationsEnabled;
    await prefs.setBool(_notificationsKey, newValue);
    state = state.copyWith(notificationsEnabled: newValue);
  }

  Future<void> setLanguage(String language) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_languageKey, language);
    state = state.copyWith(language: language);
  }
}
