import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  agencyId: z.string().optional(),
  agentId: z.string().optional(),
  hashtagId: z.string().optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial().extend({
  id: z.string(),
});

export const PostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  slug: z.string(),
  userId: z.string(),
  agencyId: z.string().optional(),
  agentId: z.string().optional(),
  hashtagId: z.string().optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  Photo: z.array(z.any()).optional(),
  Agency: z.any().optional(),
  Agent: z.any().optional(),
  Hashtag: z.any().optional(),
  User: z.any().optional(),
});

export type Post = z.infer<typeof PostSchema>;

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
