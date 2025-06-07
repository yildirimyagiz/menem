import type { Agency, Facility, Task, User } from "./interfaces";

// Make all properties optional and convert enum types to string
type APIEntity<T> = {
  [K in keyof T]?: T[K] extends "PENDING" | "ACTIVE" | "SUSPENDED"
    ? string
    : T[K] extends (infer U)[] // Handle arrays
      ? U extends object
        ? APIEntity<U>[] // Recursively convert array elements
        : U[]
      : T[K] extends object // Handle nested objects
        ? APIEntity<T[K]>
        : T[K];
};

// Define API types with flexible structure
export type APIAgency = APIEntity<Agency>;
export type APIUser = APIEntity<User>;
export type APIFacility = APIEntity<Facility>;

// Task from API with all nested types handled
export type APITask = APIEntity<Task>;
