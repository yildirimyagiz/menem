import { useCallback } from "react";

import { mobileApiClient } from "~/utils/mobile-api-client";

export interface UseMobileApiOptions {
  baseUrl?: string;
  token?: string | null;
}

export function useMobileApi(options?: UseMobileApiOptions) {
  const setToken = useCallback((token: string | null) => {
    mobileApiClient.setToken(token);
  }, []);

  const setBaseUrl = useCallback((baseUrl: string) => {
    mobileApiClient.setBaseUrl(baseUrl);
  }, []);

  const get = useCallback(
    async <T = unknown>(endpoint: string, options?: RequestInit) => {
      return mobileApiClient.get<T>(endpoint, options);
    },
    [],
  );

  const post = useCallback(
    async <T = unknown>(
      endpoint: string,
      data?: unknown,
      options?: RequestInit,
    ) => {
      return mobileApiClient.post<T>(endpoint, data, options);
    },
    [],
  );

  const put = useCallback(
    async <T = unknown>(
      endpoint: string,
      data?: unknown,
      options?: RequestInit,
    ) => {
      return mobileApiClient.put<T>(endpoint, data, options);
    },
    [],
  );

  const del = useCallback(
    async <T = unknown>(endpoint: string, options?: RequestInit) => {
      return mobileApiClient.delete<T>(endpoint, options);
    },
    [],
  );

  const upload = useCallback(
    async <T = unknown>(
      endpoint: string,
      formData: FormData,
      options?: RequestInit,
    ) => {
      return mobileApiClient.upload<T>(endpoint, formData, options);
    },
    [],
  );

  // Initialize with options if provided
  if (options?.token) {
    setToken(options.token);
  }
  if (options?.baseUrl) {
    setBaseUrl(options.baseUrl);
  }

  return {
    get,
    post,
    put,
    delete: del,
    upload,
    setToken,
    setBaseUrl,
  };
}
