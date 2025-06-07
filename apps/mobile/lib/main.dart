import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:mobile/generated/l10n.dart';

import 'config/env.dart';
import 'screens/auth/login_screen.dart';
import 'screens/main/home_screen.dart';
import 'screens/main/error_screen.dart';
import 'services/navigation_service.dart';
import 'utils/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Stripe only for mobile platforms
  if (!kIsWeb) {
    Stripe.publishableKey = Env.stripePublicKey;
    await Stripe.instance.applySettings();
  }

  NavigationService.initRoutes();
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  static void setLocale(BuildContext context, Locale newLocale) {
    final _MyAppState? state = context.findAncestorStateOfType<_MyAppState>();
    state?.setLocale(newLocale);
  }

  @override
  State<MyApp> createState() => _MyAppState();
}

Color hslToColor(double h, double s, double l) {
  // Convert HSL to RGB, then to Color
  s /= 100;
  l /= 100;
  final c = (1 - (2 * l - 1).abs()) * s;
  final x = c * (1 - ((h / 60) % 2 - 1).abs());
  final m = l - c / 2;
  double r = 0, g = 0, b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return Color.fromARGB(
    255,
    ((r + m) * 255).round(),
    ((g + m) * 255).round(),
    ((b + m) * 255).round(),
  );
}

ThemeData buildTheme(Brightness brightness) {
  // Tailwind global.css variable mappings
  final isDark = brightness == Brightness.dark;
  final background = isDark ? hslToColor(240, 10, 3.9) : hslToColor(0, 0, 100);
  final foreground = isDark ? hslToColor(0, 0, 98) : hslToColor(240, 10, 3.9);
  final card = isDark ? hslToColor(240, 10, 3.9) : hslToColor(0, 0, 100);
  final cardForeground =
      isDark ? hslToColor(0, 0, 98) : hslToColor(240, 10, 3.9);
  final popover = isDark ? hslToColor(240, 10, 3.9) : hslToColor(0, 0, 100);
  final primary = hslToColor(210, 60, 50);
  final primaryForeground = hslToColor(240, 5.9, 90);
  final secondary =
      isDark ? hslToColor(240, 3.7, 15.9) : hslToColor(240, 4.8, 95.9);
  final secondaryForeground =
      isDark ? hslToColor(0, 0, 98) : hslToColor(240, 5.9, 10);
  final mutedForeground =
      isDark ? hslToColor(240, 5, 64.9) : hslToColor(240, 3.8, 46.1);
  final accent =
      isDark ? hslToColor(240, 3.7, 15.9) : hslToColor(240, 4.8, 95.9);
  final accentForeground =
      isDark ? hslToColor(0, 0, 98) : hslToColor(240, 5.9, 10);
  final destructive =
      isDark ? hslToColor(0, 62.8, 30.6) : hslToColor(0, 72.22, 50.59);
  final destructiveForeground =
      isDark ? hslToColor(0, 85.7, 97.3) : hslToColor(0, 0, 98);
  final border = isDark ? hslToColor(240, 3.7, 15.9) : hslToColor(240, 5.9, 90);
  final input = isDark ? hslToColor(240, 3.7, 15.9) : hslToColor(240, 5.9, 90);

  return ThemeData(
    brightness: brightness,
    colorScheme: ColorScheme(
      brightness: brightness,
      primary: primary,
      onPrimary: primaryForeground,
      secondary: secondary,
      onSecondary: secondaryForeground,
      error: destructive,
      onError: destructiveForeground,
      surface: card,
      onSurface: cardForeground,
    ),
    scaffoldBackgroundColor: background,
    cardColor: card,
    dividerColor: border,
    inputDecorationTheme: InputDecorationTheme(
      fillColor: input,
      filled: true,
      border: OutlineInputBorder(
        borderSide: BorderSide(color: border),
        borderRadius: BorderRadius.circular(8),
      ),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: background,
      foregroundColor: foreground,
      elevation: 0,
      iconTheme: IconThemeData(color: primary),
      titleTextStyle: TextStyle(
        color: foreground,
        fontWeight: FontWeight.bold,
        fontSize: 20,
      ),
    ),
    textTheme: TextTheme(
      bodyLarge: TextStyle(color: foreground),
      bodyMedium: TextStyle(color: foreground),
      bodySmall: TextStyle(color: mutedForeground),
      titleLarge: TextStyle(color: foreground, fontWeight: FontWeight.bold),
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: accent,
      foregroundColor: accentForeground,
    ),
    buttonTheme: ButtonThemeData(
      buttonColor: primary,
      textTheme: ButtonTextTheme.primary,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
    useMaterial3: true,
    dialogTheme: DialogThemeData(backgroundColor: popover),
  );
}

class _MyAppState extends State<MyApp> {
  Locale? _locale;

  void setLocale(Locale locale) {
    setState(() {
      _locale = locale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Menem',
      navigatorKey: NavigationService.navigatorKey,
      onGenerateRoute: NavigationService.router.generator,
      theme: buildTheme(Brightness.light),
      darkTheme: buildTheme(Brightness.dark),
      themeMode: ThemeMode.system,
      locale: _locale,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>?>(
      future: AuthService.getCurrentUser(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (snapshot.hasError) {
          // print('Error checking authentication: ${snapshot.error}');
          return ErrorScreen(
            message: 'Error checking authentication: ${snapshot.error}',
          );
        }

        final user = snapshot.data;
        // print('Current user: $user'); // Debugging line
        if (user == null) {
          return const LoginScreen();
        }

        return const HomeScreen();
      },
    );
  }
}
