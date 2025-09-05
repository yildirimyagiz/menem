import type { Prisma } from "@prisma/client";
import { logger } from "./logger";

export interface QueryMetrics {
  queryCount: number;
  executionTime: number;
  cacheHits: number;
  cacheMisses: number;
}

export class QueryOptimizer {
  private static instance: QueryOptimizer | null = null;
  private metrics = new Map<string, QueryMetrics>();
  private queryCache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): QueryOptimizer {
    QueryOptimizer.instance ??= new QueryOptimizer();
    return QueryOptimizer.instance;
  }

  // Optimize property queries with proper includes
  static getOptimizedPropertyInclude(includePhotos = true, includeRelations = true) {
    const include: Prisma.PropertyInclude = {
      Location: includeRelations,
      Agency: includeRelations,
      Owner: includeRelations,
      Agent: includeRelations,
    };

    if (includePhotos) {
      include.Photo = {
        take: 10,
        orderBy: { createdAt: "desc" },
      };
    }

    if (includeRelations) {
      include.PricingRules = {
        include: { currency: true },
      };
      include.Review = {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          User: {
            select: { id: true, name: true, image: true },
          },
        },
      };
    }

    return include;
  }

  // Optimize task queries
  static getOptimizedTaskInclude() {
    return {
      Property: {
        select: {
          id: true,
          title: true,
        },
      },
    };
  }

  // Optimize user queries
  static getOptimizedUserInclude() {
    return {
      Agency: {
        select: {
          id: true,
          name: true,
        },
      },
      Agent: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    } satisfies Prisma.UserInclude;
  }

  // Batch queries to prevent N+1
  static async batchQuery<T>(
    db: unknown,
    model: string,
    ids: string[],
    include?: unknown,
    batchSize = 100
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      // Type assertion for dynamic model access
      const dbModel = (db as Record<string, unknown>)[model] as {
        findMany: (params: { where: { id: { in: string[] } }; include?: unknown }) => Promise<T[]>;
      };
      const batchResults = await dbModel.findMany({
        where: { id: { in: batch } },
        include,
      });
      results.push(...batchResults);
    }
    
    return results;
  }

  // Optimize pagination with cursor-based pagination
  static getCursorPagination(cursor?: string, limit = 20) {
    return {
      take: limit + 1, // Take one extra to check if there are more results
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor
      }),
    };
  }

  // Add database indexes recommendations
  static getRecommendedIndexes() {
    return [
      // Property indexes
      "CREATE INDEX IF NOT EXISTS idx_property_status ON Property(status);",
      "CREATE INDEX IF NOT EXISTS idx_property_type ON Property(type);",
      "CREATE INDEX IF NOT EXISTS idx_property_owner ON Property(ownerId);",
      "CREATE INDEX IF NOT EXISTS idx_property_agency ON Property(agencyId);",
      "CREATE INDEX IF NOT EXISTS idx_property_price ON Property(price);",
      "CREATE INDEX IF NOT EXISTS idx_property_created ON Property(createdAt);",
      
      // Task indexes
      "CREATE INDEX IF NOT EXISTS idx_task_status ON Task(status);",
      "CREATE INDEX IF NOT EXISTS idx_task_priority ON Task(priority);",
      "CREATE INDEX IF NOT EXISTS idx_task_created_by ON Task(createdById);",
      "CREATE INDEX IF NOT EXISTS idx_task_assigned_to ON Task(assignedToId);",
      "CREATE INDEX IF NOT EXISTS idx_task_due_date ON Task(dueDate);",
      "CREATE INDEX IF NOT EXISTS idx_task_property ON Task(propertyId);",
      
      // User indexes
      "CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);",
      "CREATE INDEX IF NOT EXISTS idx_user_role ON User(role);",
      "CREATE INDEX IF NOT EXISTS idx_user_agency ON User(agencyId);",
      "CREATE INDEX IF NOT EXISTS idx_user_active ON User(isActive);",
      
      // Composite indexes for common queries
      "CREATE INDEX IF NOT EXISTS idx_property_status_type ON Property(status, type);",
      "CREATE INDEX IF NOT EXISTS idx_task_status_priority ON Task(status, priority);",
      "CREATE INDEX IF NOT EXISTS idx_user_role_agency ON User(role, agencyId);",
    ];
  }

  // Cache management
  getCacheKey(operation: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join("|");
    return `${operation}:${sortedParams}`;
  }

  getCached<T>(key: string): T | null {
    const cached = this.queryCache.get(key);
    if (!cached) {
      this.incrementMetric(key, "cacheMisses");
      return null;
    }

    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.queryCache.delete(key);
      this.incrementMetric(key, "cacheMisses");
      return null;
    }

    this.incrementMetric(key, "cacheHits");
    return cached.data as T;
  }

  setCached<T>(key: string, data: T): void {
    this.queryCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Metrics tracking
  private incrementMetric(key: string, metric: keyof QueryMetrics): void {
          const current = this.metrics.get(key) ?? {
        queryCount: 0,
        executionTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
      };
    
    current[metric]++;
    this.metrics.set(key, current);
  }

  getMetrics(): Record<string, QueryMetrics> {
    return Object.fromEntries(this.metrics);
  }

  // Query performance monitoring
  static async monitorQuery<T>(
    operation: string,
    queryFn: () => Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    const optimizer = QueryOptimizer.getInstance();
    const startTime = Date.now();

    try {
      // Check cache first
      if (cacheKey) {
        const cached = optimizer.getCached<T>(cacheKey);
        if (cached) {
          logger.debug(`Cache hit for ${operation}`, {
            operation,
            cacheKey,
            executionTime: Date.now() - startTime,
          });
          return cached;
        }
      }

      // Execute query
      const result = await queryFn();
      const executionTime = Date.now() - startTime;

      // Cache result
      if (cacheKey) {
        optimizer.setCached(cacheKey, result);
      }

      // Log performance metrics
      logger.info(`Query executed: ${operation}`, {
        operation,
        executionTime,
        cacheKey,
      });

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      logger.error(`Query failed: ${operation}`, error instanceof Error ? error : undefined, {
        executionTime,
      });
      throw error;
    }
  }
}

// Export singleton instance
export const queryOptimizer = QueryOptimizer.getInstance(); 