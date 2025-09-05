export interface MobileConfig {
  apiUrl: string;
  wsUrl: string;
  isMobile: boolean;
  platform: "web" | "ios" | "android";
  serverUrl: string;
}

export function getMobileConfig(): MobileConfig {
  const isCapacitor =
    typeof window !== "undefined" && (window as any).Capacitor;
  const isMobileViewport =
    typeof window !== "undefined" && window.innerWidth <= 768;

  let platform: "web" | "ios" | "android" = "web";
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  let wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:2998";
  let serverUrl = "http://localhost:3001"; // Default mobile server URL

  if (isCapacitor) {
    // Detect platform from Capacitor
    const capacitor = (window as any).Capacitor;
    if (capacitor.getPlatform) {
      const detectedPlatform = capacitor.getPlatform();
      if (detectedPlatform === "ios") {
        platform = "ios";
      } else if (detectedPlatform === "android") {
        platform = "android";
      }
    }

    // For mobile, use the development server URL
    if (process.env.NODE_ENV === "development") {
      serverUrl = "http://10.0.2.2:3001"; // Android emulator
      if (platform === "ios") {
        serverUrl = "http://localhost:3001"; // iOS simulator
      }
    } else {
      // Production: use the API URL
      serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    }

    // Update API and WebSocket URLs for mobile
    apiUrl = serverUrl;
    wsUrl = serverUrl.replace(/^http/, "ws").replace(/^https/, "wss");
  }

  return {
    apiUrl,
    wsUrl,
    isMobile: isCapacitor || isMobileViewport,
    platform,
    serverUrl,
  };
}

export function isMobilePlatform(): boolean {
  return getMobileConfig().isMobile;
}

export function getPlatform(): "web" | "ios" | "android" {
  return getMobileConfig().platform;
}

export function getServerUrl(): string {
  return getMobileConfig().serverUrl;
}
