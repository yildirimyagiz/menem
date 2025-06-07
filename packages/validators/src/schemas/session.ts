import { z } from "zod";

// Session Schema
export const SessionSchema = z.object({
  id: z.string().uuid().optional(),
  sessionToken: z.string().min(1).max(255),
  userId: z.string().uuid(),
  expires: z.date(),

  User: z.any().optional(),
});

// Create Session Schema
export const CreateSessionSchema = z.object({
  sessionToken: z.string().min(1).max(255),
  userId: z.string().uuid(),
  expires: z.date(),
});

// Update Session Schema
export const UpdateSessionSchema = z.object({
  id: z.string().uuid(),
  sessionToken: z.string().min(1).max(255).optional(),
  expires: z.date().optional(),
});

// Zod Type Inference for TypeScript
export type Session = z.infer<typeof SessionSchema>;
export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
export type UpdateSessionInput = z.infer<typeof UpdateSessionSchema>;
