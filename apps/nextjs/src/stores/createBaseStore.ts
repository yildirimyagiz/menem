import type { StateCreator, StoreApi, UseBoundStore } from "zustand";
import type { PersistOptions } from "zustand/middleware";
import { debounce } from "lodash";
import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";

// Base Types
export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface FilterOperator<T> {
  eq?: T;
  ne?: T;
  gt?: T extends number ? T : never;
  gte?: T extends number ? T : never;
  lt?: T extends number ? T : never;
  lte?: T extends number ? T : never;
  in?: T[];
  nin?: T[];
  contains?: T extends string ? string : never;
  startsWith?: T extends string ? string : never;
  endsWith?: T extends string ? string : never;
}

interface FilterOptions<T> {
  page?: number;
  limit?: number;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
  search?: string;
  where?: {
    [K in keyof T]?: FilterOperator<T[K]>;
  };
}

interface CacheConfig {
  ttl: number;
  maxSize?: number;
}

interface CacheEntry<T> {
  item: T;
  timestamp: number;
}

interface BaseState<T extends BaseEntity> {
  data: T | null;
  items: T[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  filters: FilterOptions<T>;
  selectedIds: string[];
  cache: Record<string, CacheEntry<T>>;
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

interface Subscription {
  unsubscribe: () => void;
}

interface BaseActions<T extends BaseEntity> {
  // Single Item Operations
  setItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  clearItem: () => void;

  // Bulk Operations
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  addItems: (items: T[]) => void;
  removeItem: (id: string) => void;
  removeItems: (ids: string[]) => void;
  batchUpdate: (updates: { id: string; updates: Partial<T> }[]) => void;

  // Selection Management
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;

  // Status Management
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  resetState: () => void;

  // Filter Management
  setFilters: (filters: Partial<FilterOptions<T>>) => void;
  clearFilters: () => void;

  // Cache Management
  setCached: (id: string, item: T) => void;
  getCached: (id: string) => T | undefined;
  clearCache: () => void;

  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setMeta: (meta: Partial<BaseState<T>["meta"]>) => void;

  // Advanced Operations
  optimisticUpdate: (
    id: string,
    updates: Partial<T>,
    operation: Promise<any>,
  ) => Promise<void>;
  transaction: (
    operations: (actions: BaseActions<T>) => Promise<void>,
  ) => Promise<void>;

  // Queries
  getById: (id: string) => T | null;
  getByIds: (ids: string[]) => T[];
  getFiltered: () => T[];
  getSelected: () => T[];
  getSorted: (sortBy: keyof T, order?: "asc" | "desc") => T[];
  search: (query: string, fields?: (keyof T)[]) => T[];
  advancedFilter: (options: FilterOptions<T>) => T[];

  // Subscriptions
  subscribe: {
    onItemChange: (
      id: string,
      callback: (item: T | undefined) => void,
    ) => Subscription;
    onItemsChange: (callback: (items: T[]) => void) => Subscription;
    onFilterChange: (
      callback: (filters: FilterOptions<T>) => void,
    ) => Subscription;
  };
}

interface StoreOptions<T extends BaseEntity> {
  name: string;
  persist?: boolean;
  version?: number;
  cache?: CacheConfig;
  onError?: (error: Error) => void;
  logging?: {
    enabled?: boolean;
    level?: "error" | "warn" | "info" | "debug";
  };
  transformers?: {
    serialize?: (item: T) => any;
    deserialize?: (data: any) => T;
  };
  middleware?: ((
    store: StateCreator<BaseState<T> & BaseActions<T>>,
  ) => StateCreator<BaseState<T> & BaseActions<T>>)[];
}

const createLogger = (options?: StoreOptions<any>["logging"]) => ({
  error: (...args: any[]) =>
    options?.enabled && options.level !== "info" && console.error(...args),
  warn: (...args: any[]) =>
    options?.enabled && options.level !== "error" && console.warn(...args),
  info: (...args: any[]) =>
    options?.enabled && options.level === "debug" && console.info(...args),
  debug: (...args: any[]) =>
    options?.enabled && options.level === "debug" && console.debug(...args),
});

// Define middleware types
type StoreMiddleware<T> = (
  config: StateCreator<T>,
  options: {
    name?: string;
    getStorage?: () => Storage;
    serialize?: (state: T) => any;
    deserialize?: (serializedState: any) => T;
  },
) => StateCreator<T>;

const createStoreWithMiddleware = <T>(
  initializer: StateCreator<T>,
  middlewares: StoreMiddleware<T>[],
  storeOptions: StoreOptions<any>,
): UseBoundStore<StoreApi<T>> => {
  return create<T>()((...args) => {
    let store = initializer;
    middlewares.forEach((middleware) => {
      store = middleware(store, {
        name: storeOptions.name,
        getStorage: () => {
          if (typeof window === "undefined") {
            throw new Error(
              "localStorage is not available in this environment",
            );
          }
          return window.localStorage;
        },
        serialize: storeOptions.transformers?.serialize,
        deserialize: storeOptions.transformers?.deserialize,
      });
    });
    return store(...args);
  });
};
export const createBaseStore = <T extends BaseEntity>(
  options: StoreOptions<T>,
) => {
  const logger = createLogger(options.logging);
  const cacheTTL = options.cache?.ttl ?? 1000 * 60 * 5; // 5 minutes default TTL

  const initialState: BaseState<T> = {
    data: null,
    items: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    filters: {},
    selectedIds: [],
    cache: {},
    meta: {
      total: 0,
      totalPages: 0,
      currentPage: 1,
    },
  };

  let middleware: StoreMiddleware<BaseState<T> & BaseActions<T>>[] = [];
  if (options.persist) {
    const storage = {
      getItem: async (name: string) => {
        if (typeof window === "undefined") return null;
        const str = window.localStorage.getItem(name);
        return str ? JSON.parse(str) : null;
      },
      setItem: async (name: string, value: unknown) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: async (name: string) => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(name);
      },
    };

    const persistOptions: PersistOptions<BaseState<T> & BaseActions<T>> = {
      name: `${options.name}-storage`,
      version: options.version ?? 1,
      storage,
      partialize: (state) => {
        return {
          items: state.items,
          filters: state.filters,
        } as unknown as BaseState<T> & BaseActions<T>;
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as BaseState<T>;
        return {
          ...currentState,
          items: options.transformers?.deserialize
            ? state.items.map(options.transformers.deserialize)
            : state.items,
          filters: state.filters,
        };
      },
    };

    middleware.push(
      (config) =>
        persist(config, persistOptions) as StateCreator<
          BaseState<T> & BaseActions<T>
        >,
    );
  }

  if (options.middleware) {
    middleware = [...middleware, ...options.middleware];
  }

  const store = createStoreWithMiddleware<BaseState<T> & BaseActions<T>>(
    (set, get) => ({
      ...initialState,

      // Single Item Operations
      setItem: (item) => {
        logger.debug("Setting item:", item);
        set({ data: item, lastUpdated: new Date() });
      },

      updateItem: (id, updates) => {
        logger.debug("Updating item:", id, updates);
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date() }
              : item,
          );
          const newCache = { ...state.cache };
          delete newCache[id]; // Remove from cache instead of setting undefined

          return {
            ...state,
            items: updatedItems,
            data:
              state.data?.id === id
                ? { ...state.data, ...updates, updatedAt: new Date() }
                : state.data,
            lastUpdated: new Date(),
            cache: newCache,
          };
        });
      },

      clearItem: () => {
        logger.debug("Clearing item");
        set({ data: null });
      },

      // Bulk Operations
      setItems: (items) => {
        logger.debug("Setting items:", items.length);
        set({
          items,
          lastUpdated: new Date(),
          meta: {
            ...get().meta,
            total: items.length,
            totalPages: Math.ceil(items.length / (get().filters.limit ?? 1)),
            currentPage: get().filters.page ?? 1,
          },
        });
      },

      addItem: (item) => {
        logger.debug("Adding item:", item);
        set((state) => ({
          items: [...state.items, { ...item, createdAt: new Date() }],
          lastUpdated: new Date(),
        }));
      },

      addItems: (newItems) => {
        logger.debug("Adding items:", newItems.length);
        set((state) => ({
          items: [
            ...state.items,
            ...newItems.map((item) => ({ ...item, createdAt: new Date() })),
          ],
          lastUpdated: new Date(),
        }));
      },

      removeItem: (id) => {
        logger.debug("Removing item:", id);
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          data: state.data?.id === id ? null : state.data,
          selectedIds: state.selectedIds.filter(
            (selectedId) => selectedId !== id,
          ),
          cache: Object.fromEntries(
            Object.entries(state.cache).filter(([key]) => key !== id),
          ),
          lastUpdated: new Date(),
        }));
      },

      removeItems: (ids) => {
        logger.debug("Removing items:", ids);
        set((state) => ({
          items: state.items.filter((item) => !ids.includes(item.id)),
          selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
          cache: Object.fromEntries(
            Object.entries(state.cache).filter(([key]) => !ids.includes(key)),
          ),
          lastUpdated: new Date(),
        }));
      },

      batchUpdate: (updates) => {
        logger.debug("Batch updating items:", updates.length);
        set((state) => ({
          items: state.items.map((item) => {
            const update = updates.find((u) => u.id === item.id);
            return update
              ? { ...item, ...update.updates, updatedAt: new Date() }
              : item;
          }),
          lastUpdated: new Date(),
        }));
      },

      // Selection Management
      selectItem: (id) => {
        logger.debug("Selecting item:", id);
        set((state) => ({
          selectedIds: [...state.selectedIds, id],
        }));
      },

      deselectItem: (id) => {
        logger.debug("Deselecting item:", id);
        set((state) => ({
          selectedIds: state.selectedIds.filter(
            (selectedId) => selectedId !== id,
          ),
        }));
      },

      selectAll: () => {
        logger.debug("Selecting all items");
        set((state) => ({
          selectedIds: state.items.map((item) => item.id),
        }));
      },

      deselectAll: () => {
        logger.debug("Deselecting all items");
        set({ selectedIds: [] });
      },

      // Status Management
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => {
        if (error) {
          logger.error("Store error:", error);
          options.onError?.(error);
        }
        set({ error });
      },
      resetState: () => {
        logger.debug("Resetting state");
        set(initialState);
      },

      // Filter Management
      setFilters: (filters) => {
        logger.debug("Setting filters:", filters);
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },
      clearFilters: () => {
        logger.debug("Clearing filters");
        set({ filters: {} });
      },

      // Cache Management
      setCached: (id, item) => {
        const timestamp = Date.now();
        const maxSize = options.cache?.maxSize;

        set((state) => {
          const newCache: Record<string, CacheEntry<T>> = { ...state.cache };

          if (maxSize && Object.keys(newCache).length >= maxSize) {
            const entries = Object.entries(newCache);
            if (entries.length > 0) {
              const oldestEntry = entries.sort(
                ([, a], [, b]) => a.timestamp - b.timestamp,
              )[0];
              if (oldestEntry) {
                delete newCache[oldestEntry[0]];
              }
            }
          }

          return {
            cache: {
              ...newCache,
              [id]: { item, timestamp },
            },
          };
        });
      },

      getCached: (id) => {
        const cached = get().cache[id];
        if (!cached) return undefined;
        if (Date.now() - cached.timestamp > cacheTTL) {
          logger.debug("Cache expired for item:", id);
          set((state) => ({
            cache: Object.fromEntries(
              Object.entries(state.cache).filter(([k]) => k !== id),
            ) as Record<string, CacheEntry<T>>,
          }));
          return undefined;
        }
        return cached.item;
      },

      clearCache: () =>
        set((state) => ({
          ...state,
          cache: {} as Record<string, CacheEntry<T>>,
        })),

      // Pagination
      setPage: (page) =>
        set((state) => ({
          meta: { ...state.meta, currentPage: page },
        })),
      setLimit: (limit) =>
        set((state) => ({
          meta: {
            ...state.meta,
            totalPages: Math.ceil(state.items.length / limit),
            currentPage: 1,
          },
          filters: { ...state.filters, limit },
        })),
      setMeta: (meta) =>
        set((state) => ({
          meta: { ...state.meta, ...meta },
        })),

      // Advanced Operations
      optimisticUpdate: async (id, updates, operation) => {
        const previousState = get().items;
        logger.debug("Optimistic update:", id, updates);

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        }));

        try {
          await operation;
        } catch (error) {
          logger.error("Optimistic update failed:", error);
          set({ items: previousState });
          options.onError?.(error as Error);
        }
      },

      transaction: async (operations) => {
        const snapshot = get().items;
        logger.debug("Starting transaction");

        try {
          await operations(get());
          set({ lastUpdated: new Date() });
          logger.debug("Transaction completed");
        } catch (error) {
          logger.error("Transaction failed:", error);
          set({ items: snapshot });
          options.onError?.(error as Error);
        }
      },

      // Queries
      getById: (id) => get().items.find((item) => item.id === id) ?? null,

      getByIds: (ids) => {
        logger.debug("Getting items by ids:", ids);
        const { items } = get();
        return items.filter((item) => ids.includes(item.id));
      },

      getFiltered: () => {
        const { items, filters } = get();
        return items.filter((item) =>
          Object.entries(filters).every(([key, value]) => {
            if (key === "search" || key === "page" || key === "limit")
              return true;
            if (Array.isArray(value))
              return value.includes(item[key as keyof T]);
            return item[key as keyof T] === value;
          }),
        );
      },

      getSelected: () =>
        get().items.filter((item) => get().selectedIds.includes(item.id)),

      getSorted: (sortBy, order = "asc") => {
        const { items } = get();
        return [...items].sort((a, b) => {
          if (a[sortBy] < b[sortBy]) return order === "asc" ? -1 : 1;
          if (a[sortBy] > b[sortBy]) return order === "asc" ? 1 : -1;
          return 0;
        });
      },

      search: debounce((query: string, fields?: (keyof T)[]) => {
        const { items } = get();
        if (!items.length || !query) return items;

        const item = items[0];
        const searchFields =
          fields ?? (item ? (Object.keys(item) as (keyof T)[]) : []);
        const lowercaseQuery = query.toLowerCase();

        return items.filter((item) =>
          searchFields.some((field) => {
            const value = item[field];
            return (
              value != null &&
              String(value).toLowerCase().includes(lowercaseQuery)
            );
          }),
        );
      }, 300) as (query: string, fields?: (keyof T)[]) => T[],

      advancedFilter: (options) => {
        const { items } = get();
        return items.filter((item) => {
          if (!options.where) return true;

          return Object.entries(options.where).every(([field, operators]) => {
            const value = item[field as keyof T];

            return Object.entries(operators).every(
              ([operator, compareValue]) => {
                switch (operator) {
                  case "eq":
                    return value === (compareValue as any);
                  case "ne":
                    return value !== (compareValue as any);
                  case "gt":
                    return (
                      typeof value === "number" &&
                      value > (compareValue as number)
                    );
                  case "gte":
                    return (
                      typeof value === "number" &&
                      value >= (compareValue as number)
                    );
                  case "lt":
                    return (
                      typeof value === "number" &&
                      value < (compareValue as number)
                    );
                  case "lte":
                    return (
                      typeof value === "number" &&
                      value <= (compareValue as number)
                    );
                  case "in":
                    return (
                      Array.isArray(compareValue) &&
                      compareValue.includes(value)
                    );
                  case "nin":
                    return (
                      !Array.isArray(compareValue) ||
                      !compareValue.includes(value)
                    );
                  case "contains":
                    return (
                      typeof value === "string" &&
                      value.includes(compareValue as string)
                    );
                  case "startsWith":
                    return (value as any)
                      .toString()
                      .startsWith(compareValue as any);
                  case "endsWith":
                    return (value as any)
                      .toString()
                      .endsWith(compareValue as any);
                  default:
                    return true;
                }
              },
            );
          });
        });
      },

      // Subscriptions
      subscribe: {
        onItemChange: (
          id: string,
          callback: (item: T | undefined) => void,
        ): Subscription => ({
          unsubscribe: store.subscribe((state) =>
            state.items.find((item) => item.id === id),
          ),
        }),
        onItemsChange: (callback: (items: T[]) => void): Subscription => ({
          unsubscribe: store.subscribe((state) => callback(state.items)),
        }),
        onFilterChange: (
          callback: (filters: FilterOptions<T>) => void,
        ): Subscription => ({
          unsubscribe: store.subscribe((state) => callback(state.filters)),
        }),
      },
    }),
    middleware,
    options,
  );

  return store;
};
