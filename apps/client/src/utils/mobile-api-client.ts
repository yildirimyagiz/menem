import { getMobileConfig } from "./mobile-config";

export interface MobileApiClientOptions {
  token?: string | null;
  baseUrl?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

export class MobileApiClient {
  private token: string | null = null;
  private baseUrl: string;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(options?: MobileApiClientOptions) {
    this.token = options?.token ?? null;
    this.baseUrl = this.resolveBaseUrl(options?.baseUrl);
    this.retryAttempts = options?.retryAttempts ?? 3;
    this.retryDelay = options?.retryDelay ?? 1000;
  }

  private resolveBaseUrl(customBaseUrl?: string): string {
    // If custom base URL is provided, use it
    if (customBaseUrl) {
      return customBaseUrl;
    }

    // Check if we're running in a mobile environment
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      // For mobile, use the server URL from mobile config
      const config = getMobileConfig();
      return config.serverUrl;
    }

    // For web, use the current origin or fallback
    if (typeof window !== "undefined") {
      return window.location.origin;
    }

    // Server-side fallback
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  setToken(token: string | null) {
    this.token = token;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt < this.retryAttempts && this.isRetryableError(error)) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.retryRequest(requestFn, attempt + 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, 5xx server errors, and rate limiting
    if (error instanceof TypeError) return true; // Network error
    if (error.status >= 500 && error.status < 600) return true; // Server error
    if (error.status === 429) return true; // Rate limiting
    return false;
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers(options.headers ?? {});

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    // Add mobile-specific headers
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      headers.set("X-Platform", "mobile");
      headers.set("X-App-Version", "1.0.0");
    }

    return this.retryRequest(async () => {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = new Error(`API error: ${response.status} - ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }

      // Attempt to parse JSON, but fallback to text if not JSON
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return response.json() as Promise<T>;
      }

      // If not JSON, return as text (typed as unknown)
      return response.text() as unknown as T;
    });
  }

  // Convenience methods for common HTTP operations
  async get<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  }

  async delete<T = unknown>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async upload<T = unknown>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      // Don't set Content-Type for FormData, let the browser set it with boundary
    });
  }
}

// Singleton instance for use throughout the app
export const mobileApiClient = new MobileApiClient({
  token: typeof window !== "undefined" ? localStorage.getItem("jwt") : null,
});
