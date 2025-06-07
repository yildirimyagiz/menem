// Standardized API error helper
export function apiError(message: string, status = 400) {
  const err = new Error(message);
  // @ts-expect-error: Error type does not have a status property, but we want to attach HTTP status codes for API errors
  err.status = status;
  return err;
}
