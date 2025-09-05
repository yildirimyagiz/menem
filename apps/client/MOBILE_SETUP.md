# Mobile Setup with Capacitor (Hybrid Approach)

This guide explains how to set up and use Capacitor for mobile app development with the Reservatior client using a hybrid approach that maintains dynamic features.

## Prerequisites

- Node.js 18+ and pnpm
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Capacitor CLI

## Installation

Capacitor dependencies are already installed. The following packages are included:

- `@capacitor/core` - Core Capacitor functionality
- `@capacitor/cli` - Command line interface
- `@capacitor/ios` - iOS platform support
- `@capacitor/android` - Android platform support

## Environment Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```env
# API Configuration for Mobile
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:2998

# For production, update these URLs:
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
# NEXT_PUBLIC_WS_URL=wss://your-api-domain.com
```

### 2. Capacitor Configuration

The Capacitor configuration is set up in `capacitor.config.json` for hybrid approach:

```json
{
  "appId": "com.reservatior.client",
  "appName": "Reservatior",
  "webDir": ".next",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 3000,
      "backgroundColor": "#ffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true
    }
  }
}
```

## Available Scripts

### Development

```bash
# Start development server
pnpm dev

# Start development server for mobile (port 3001)
pnpm dev:mobile

# Build for production
pnpm build

# Start production server
pnpm start

# Start production server for mobile (port 3001)
pnpm start:mobile
```

### Mobile Development

```bash
# Initialize Capacitor (first time only)
pnpm cap:init

# Add Android platform
pnpm cap:add:android

# Add iOS platform (macOS only)
pnpm cap:add:ios

# Sync web code to mobile platforms
pnpm cap:sync

# Build and sync for mobile
pnpm cap:build

# Run on Android device/emulator
pnpm cap:run:android

# Run on iOS device/simulator (macOS only)
pnpm cap:run:ios

# Open Android Studio
pnpm cap:open:android

# Open Xcode (macOS only)
pnpm cap:open:ios

# Development with live reload (Android)
pnpm cap:dev:android

# Development with live reload (iOS)
pnpm cap:dev:ios
```

## Hybrid Approach Benefits

This setup uses a hybrid approach that:

- **Maintains Dynamic Features**: Keeps all Next.js dynamic features like API routes, server-side rendering, and real-time updates
- **Mobile Optimized**: Provides mobile-specific configurations and headers
- **Development Friendly**: Supports live reload and hot development
- **Production Ready**: Can be deployed to mobile app stores

## Mobile-Specific Features

### 1. Mobile API Client

Use the mobile-specific API client for better mobile support:

```typescript
import { useMobileApi } from "~/hooks/use-mobile-api";

function MyComponent() {
  const { get, post, setToken } = useMobileApi({
    baseUrl: "https://your-api.com",
    token: "your-jwt-token",
  });

  const fetchData = async () => {
    const data = await get("/api/endpoint");
    // Handle response
  };
}
```

### 2. Mobile Layout Component

Use the mobile layout component for mobile-optimized UI:

```typescript
import { MobileLayout } from '~/app/_components/MobileLayout';

function MyPage() {
  return (
    <MobileLayout>
      {/* Your content */}
    </MobileLayout>
  );
}
```

### 3. Mobile Configuration

Access mobile-specific configuration:

```typescript
import { getMobileConfig, isMobilePlatform } from "~/utils/mobile-config";

const config = getMobileConfig();
console.log("Is mobile:", config.isMobile);
console.log("Platform:", config.platform);
console.log("API URL:", config.apiUrl);
console.log("Server URL:", config.serverUrl);
```

## Development Workflow

### 1. Initial Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your API URLs

# 3. Initialize Capacitor
pnpm cap:init

# 4. Add platforms
pnpm cap:add:android
pnpm cap:add:ios  # macOS only
```

### 2. Development Cycle

```bash
# 1. Start development server for mobile
pnpm dev:mobile

# 2. In another terminal, run Capacitor with live reload
pnpm cap:dev:android
# or
pnpm cap:dev:ios
```

### 3. Production Build

```bash
# 1. Build the app
pnpm build

# 2. Sync to mobile platforms
pnpm cap:sync

# 3. Run on device/emulator
pnpm cap:run:android
# or
pnpm cap:run:ios
```

## Platform-Specific Setup

### Android

1. Install Android Studio
2. Set up Android SDK
3. Create an Android Virtual Device (AVD) or connect a physical device
4. Run `pnpm cap:run:android`

### iOS (macOS only)

1. Install Xcode
2. Install Xcode Command Line Tools
3. Set up iOS Simulator or connect a physical device
4. Run `pnpm cap:run:ios`

## API Integration

The mobile app uses the same API as the web app, but with mobile-specific headers and configuration:

- **Base URL**: Uses `NEXT_PUBLIC_API_URL` environment variable
- **Development Server**: Uses port 3001 for mobile development
- **Authentication**: JWT tokens stored in localStorage
- **Headers**: Automatically includes mobile platform headers
- **WebSocket**: Uses `NEXT_PUBLIC_WS_URL` for real-time features
- **CORS**: Configured to allow mobile app requests

## Network Configuration

### Development

- **Android Emulator**: Uses `http://10.0.2.2:3001` to access host machine
- **iOS Simulator**: Uses `http://localhost:3001`
- **Physical Devices**: Use your computer's IP address (e.g., `http://192.168.1.100:3001`)

### Production

- Uses the configured `NEXT_PUBLIC_API_URL` environment variable

## Troubleshooting

### Common Issues

1. **Build fails**: Make sure all environment variables are set
2. **API calls fail**: Check that `NEXT_PUBLIC_API_URL` is correct
3. **Live reload not working**: Ensure development server is running on port 3001
4. **Network issues**: Check that mobile device can access development server
5. **Platform detection issues**: Check Capacitor installation and configuration

### Debug Commands

```bash
# Check Capacitor status
npx capacitor doctor

# List installed plugins
npx capacitor ls

# Check platform status
npx capacitor status

# Check network connectivity
curl http://localhost:3001/api/health
```

## Production Deployment

For production deployment:

1. Update environment variables with production URLs
2. Build the app: `pnpm build`
3. Sync to platforms: `pnpm cap:sync`
4. Open platform-specific IDEs to build and deploy:
   - Android: `pnpm cap:open:android`
   - iOS: `pnpm cap:open:ios`

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Next.js Hybrid Approach](https://nextjs.org/docs/advanced-features/hybrid-apps)
- [Android Development](https://developer.android.com/)
- [iOS Development](https://developer.apple.com/ios/)
