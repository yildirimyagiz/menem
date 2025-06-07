// Standard API response formatter
export function formatResponse<T>(data: T, meta?: Record<string, unknown>) {
  return { data, meta };
}
