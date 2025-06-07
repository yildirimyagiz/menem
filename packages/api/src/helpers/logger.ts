// Simple logger utility
export function logInfo(...args: unknown[]) {
  console.log('[INFO]', ...args);
}
export function logWarn(...args: unknown[]) {
  console.warn('[WARN]', ...args);
}
export function logError(...args: unknown[]) {
  console.error('[ERROR]', ...args);
}
