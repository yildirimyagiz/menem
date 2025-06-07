import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_sound/flutter_sound.dart';

class NotificationEffectsService {
  static const String _soundEnabledKey = 'notification_sound_enabled';
  static const String _vibrationEnabledKey = 'notification_vibration_enabled';

  final FlutterSoundPlayer _audioPlayer = FlutterSoundPlayer();
  late final SharedPreferences _preferences;

  NotificationEffectsService() {
    _init();
  }

  Future<void> _init() async {
    _preferences = await SharedPreferences.getInstance();
    await _audioPlayer.openPlayer();
  }

  bool get isSoundEnabled => _preferences.getBool(_soundEnabledKey) ?? true;
  bool get isVibrationEnabled =>
      _preferences.getBool(_vibrationEnabledKey) ?? true;

  Future<void> setSoundEnabled(bool enabled) async {
    await _preferences.setBool(_soundEnabledKey, enabled);
  }

  Future<void> setVibrationEnabled(bool enabled) async {
    await _preferences.setBool(_vibrationEnabledKey, enabled);
  }

  Future<void> playNotificationSound() async {
    if (!isSoundEnabled) return;

    try {
      await _audioPlayer.startPlayer(
        fromURI: 'assets/sounds/not.mp3',
        whenFinished: () {},
      );
    } catch (e) {
      // print('Error playing notification sound: $e');
    }
  }

  Future<void> vibrate() async {
    if (!isVibrationEnabled) return;

    try {
      await HapticFeedback.mediumImpact();
    } catch (e) {
      // print('Error vibrating: $e');
    }
  }

  Future<void> dispose() async {
    await _audioPlayer.closePlayer();
  }
}
