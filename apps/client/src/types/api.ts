import type { Task, User, Property } from "~/utils/interfaces";

export interface PaginatedResponse<T> {
  data: {
    data: (T | null)[];
    total: number;
    page: number;
    limit: number;
  };
  meta?: Record<string, unknown>;
}

export type TaskResponse = PaginatedResponse<Task>;
export type UserResponse = PaginatedResponse<User>;
export type PropertyResponse = PaginatedResponse<Property>;
