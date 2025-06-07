import type { RequestInit } from "next/dist/server/web/spec-extension/request";

interface ApiError {
  message: string;
  // Add other error fields as needed
}

type ApiResponse<T> = Response & {
  json(): Promise<T>;
};

export async function apiRequest<T = unknown>(
  method: string,
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const defaultOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  };

  const response = (await fetch(url, defaultOptions)) as ApiResponse<T>;

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Network error" }) as ApiError);
    throw new Error(error.message ?? "API request failed");
  }

  return response;
}
