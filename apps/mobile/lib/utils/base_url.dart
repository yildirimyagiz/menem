import 'package:flutter/foundation.dart';

class BaseUrlUtil {
  static String getBaseUrl() {
    // Set your production URL here
    const prodUrl = 'https://your-production-api.com';
    // Set your dev URL here
    const devUrl = 'http://localhost:3000/api';

    return kReleaseMode ? prodUrl : devUrl;
  }
}
