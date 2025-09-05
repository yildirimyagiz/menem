import { globalCache } from "./cache";
import { apiError } from "./error";
import { logger } from "./logger";
import { formatResponse } from "./response";

// Unified helper for cache, logging, error, and response formatting
export async function withCacheAndFormat<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  ttlMs = 60_000,
) {
  try {
    const cached = globalCache.get<T>(cacheKey);
    if (cached) {
      logger.info("Cache hit:", { cacheKey });
      return formatResponse(cached, { cached: true });
    }
    logger.info("Cache miss:", { cacheKey });
    const result = await fn();
    globalCache.set(cacheKey, result, ttlMs);
    return formatResponse(result, { cached: false });
  } catch (e: unknown) {
    logger.error("Error in withCacheAndFormat:", e instanceof Error ? e : undefined, { cacheKey });
    let message = "Unknown error";
    // Use type guard for error
    if (isErrorWithMessage(e)) {
      message = e.message;
    }
    throw apiError(message, 500);

// Type guard for error objects
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    typeof (error as any).message === "string"
  );
}
  }
}
