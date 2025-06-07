import { z } from "zod";

// 1. Pagination input schema
export const paginationInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// 2. Helper to get skip/take for Prisma
export function getPaginationParams(input: { page?: number; limit?: number }) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 20;
  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
}

// 3. Standard paginated result type
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
