class Env {
  // API Configuration
  static const String apiBaseUrl = 'http://localhost:3000/api';
  static const String apiUrl = 'http://localhost:3000/api/trpc';
  static const String fastApiUrl = 'http://localhost:8000';
  static const String appUrl = 'http://localhost:3000';
  static const String domain = 'localhost';
  static const int apiTimeout = 30000; // 30 seconds

  // WebSocket Configuration
  static const String socketUrl = 'http://localhost:3000';
  static const String wsUrl = 'ws://localhost:2999';

  // Database Configuration
  // WARNING: Database URL with credentials should NEVER be in client-side code.
  // This should be configured and accessed ONLY by your backend server.
  // static const String databaseUrl = "REMOVE_THIS_FROM_CLIENT_SIDE";

  // Authentication
  // WARNING: Secrets like authSecret, nextAuthSecret, sessionSecret should be backend-only and NEVER in client-side code.
  static const String nextAuthUrl = 'http://localhost:3000';

  // Google Authentication
  // This is a client-side ID and generally okay, but better managed via build environment variables.
  static const String googleClientId =
      '851507782363-4favlf24174r6572rdc158ochos8t4f8.apps.googleusercontent.com';
  // WARNING: googleClientSecret should be backend-only and NEVER in client-side code.
  // static const String googleClientSecret = "REMOVE_THIS_FROM_CLIENT_SIDE";
  static const String googleMapsApiKey =
      'AIzaSyCb35OmKQht_g443dtLLMzDJA9qArHdFTM';

  // Stripe Configuration
  static const String stripePublicKey =
      'pk_test_51RDviVQpxNj41ZqpHNsG2JdXHo5b26xC6qo1cYglAzYlZg3Rkogefq6JR0yZF6TuDnAvUtJssOfbbRJIGdssipNZ009j2qV7Fa';
  // WARNING: stripeSecretKey should be backend-only and NEVER in client-side code.
  // static const String stripeSecretKey = "REMOVE_THIS_FROM_CLIENT_SIDE";

  // Email Configuration
  // WARNING: Email server credentials should be backend-only.
  static const String emailServer =
      'smtp://username:password@smtp.example.com:587';
  static const String emailFrom = 'yagizyildirim@cloud.com';
  static const String emailUser = 'your_email@example.com';
  // WARNING: emailPass should be backend-only and NEVER in client-side code.
  // static const String emailPass = "REMOVE_THIS_FROM_CLIENT_SIDE";
  static const String verificationUrl = 'http://localhost:3000/verify';

  // SMTP Configuration
  // WARNING: SMTP credentials should be backend-only.
  static const String smtpHost = 'smtp.gmail.com';
  static const int smtpPort = 465;
  static const bool smtpSecure = true;
  static const String smtpUser = 'info@bomontiemlak.com';
  // WARNING: smtpPass should be backend-only and NEVER in client-side code.
  // static const String smtpPass = "REMOVE_THIS_FROM_CLIENT_SIDE";
  static const String smtpFrom = 'yagizyildirim34@gmail.com';

  // Social Media API Keys
  // This is a client-side App ID and generally okay.
  static const String facebookApiKey = '1983617865424037';
  // WARNING: facebookApiSecret should be backend-only and NEVER in client-side code.
  // static const String facebookApiSecret = "REMOVE_THIS_FROM_CLIENT_SIDE";
  static const String twitterApiKey = 'aJCHjxcHp8bf0Ui0IrGZtfjYF';
  // WARNING: twitterSecretKey should be backend-only and NEVER in client-side code.
  // static const String twitterSecretKey = "REMOVE_THIS_FROM_CLIENT_SIDE";

  // Machine Learning Configuration
  static const int mlPort = 8000;
  static const String mlHost = '127.0.0.1';
  static const String mlModelPath = 'models';
  static const String mlUploadDir = 'uploads';
  static const String pytorchDevice = 'cpu';

  // Hotelbeds API Configuration
  // WARNING: All API keys/secrets below should be backend-only and NEVER in client-side code.
  static const String activitiesApiKey = '3a19bc9beccd6fa5d30dd9fb47209b4f';
  static const String transfersApiKey = '74ba7388dead2f97f5ff58249ce930a6';
  static const String hotelbedsApiKey = '67f2c20a6c402c063580c2df3a6e7519';

  // Amadeus API Configuration
  static const String amadeusApiKey = '9LH75LlGsA2ertDMFkJlGoNVhgBuVnyT';

  // Zillow API Configuration
  // WARNING: API keys/secrets should be backend-only.
  static const String zillowApiKey = '1234567890';
  static const String bridgeDataClientId = 'nbB2pliTRaEohMlQscXE';
  static const String bridgeBrowserToken = '89665f108d404fba29d230beff3507a4';
  static const String bridgeApiUrl = 'https://api.bridgedataoutput.com/api/v2';

  // App Configuration
  static const String appName = 'Menem';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  static const String environment = 'development';

  // Feature Flags
  static const bool enablePushNotifications = true;
  static const bool enableAnalytics = true;
  static const bool enableCrashReporting = true;

  // Cache Configuration
  static const int cacheDuration = 3600; // 1 hour in seconds
  static const int maxCacheSize = 50 * 1024 * 1024; // 50 MB

  // Payment Configuration
  static const String currency = 'USD';
  static const String currencySymbol = '\$';
  static const int minimumPaymentAmount = 100; // in cents

  // Validation
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 32;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 20;

  // Timeouts
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds
  static const int sendTimeout = 30000; // 30 seconds

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // File Upload
  static const int maxFileSize = 10 * 1024 * 1024; // 10 MB
  static const List<String> allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ];

  // Location
  static const double defaultLatitude = 0.0;
  static const double defaultLongitude = 0.0;
  static const double defaultRadius = 10.0; // in kilometers

  // Notifications
  static const int notificationCheckInterval = 300; // 5 minutes in seconds
  static const int maxNotificationAge = 86400; // 24 hours in seconds

  // Search
  static const int searchDebounceTime = 300; // milliseconds
  static const int minSearchLength = 2;
  static const int maxSearchResults = 50;

  // UI Configuration
  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 8.0;
  static const double defaultIconSize = 24.0;
  static const double defaultButtonHeight = 48.0;
  static const double defaultInputHeight = 48.0;
  static const double defaultSpacing = 8.0;

  // Animation
  static const Duration defaultAnimationDuration = Duration(milliseconds: 300);
  static const Duration longAnimationDuration = Duration(milliseconds: 500);
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);

  // Error Messages
  static const String defaultErrorMessage =
      'Something went wrong. Please try again.';
  static const String networkErrorMessage =
      'Please check your internet connection and try again.';
  static const String timeoutErrorMessage =
      'The request timed out. Please try again.';
  static const String serverErrorMessage =
      'Server error. Please try again later.';
  static const String unauthorizedErrorMessage = 'Please sign in to continue.';
  static const String forbiddenErrorMessage =
      'You do not have permission to perform this action.';
  static const String notFoundErrorMessage =
      'The requested resource was not found.';
  static const String validationErrorMessage =
      'Please check your input and try again.';
}
