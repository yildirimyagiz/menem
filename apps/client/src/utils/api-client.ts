// utils/api-client.ts
// Centralized API client that automatically attaches JWT to all outgoing requests

export interface ApiClientOptions {
  token?: string | null;
}

export class ApiClient {
  private token: string | null = null;

  constructor(options?: ApiClientOptions) {
    this.token = options?.token ?? null;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  async request<T = unknown>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(options.headers ?? {});
    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }
    const response = await fetch(url, {
      ...options,
      headers,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    // Attempt to parse JSON, but fallback to text if not JSON
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json() as Promise<T>;
    }
    // If not JSON, return as text (typed as unknown)
    return response.text() as unknown as T;
  }
}

// Singleton instance for use throughout the app
export const apiClient = new ApiClient({
  token: typeof window !== "undefined" ? localStorage.getItem("jwt") : null,
});
