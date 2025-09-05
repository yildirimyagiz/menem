// Generic memoization for pure functions (per-process)
export function memoize<TArgs extends readonly unknown[], R>(
  fn: (...args: TArgs) => R,
): (...args: TArgs) => R {
  const cache = new Map<string, { value: R }>();
  return (...args: TArgs): R => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached) return cached.value;
    const result = fn(...args);
    cache.set(key, { value: result });
    return result;
  };
}

// Type-safe memoization for single parameter functions
export function memoizeSingle<T, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<string, { value: R }>();
  return (arg: T): R => {
    const key = JSON.stringify(arg);
    const cached = cache.get(key);
    if (cached) return cached.value;
    const result = fn(arg);
    cache.set(key, { value: result });
    return result;
  };
}
