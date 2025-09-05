import { z } from "zod";

// MLConfiguration Prisma model reference:
// model MLConfiguration {
//   id                String   @id @default("singleton")
//   enableAutoTagging Boolean  @default(true)
//   qualityThreshold  Float    @default(0.75)
//   createdAt         DateTime @default(now())
//   updatedAt         DateTime @updatedAt
// }

export const MLConfigurationSchema = z.object({
  id: z.string().default("singleton"),
  enableAutoTagging: z.boolean().default(true),
  qualityThreshold: z.number().min(0).max(1).default(0.75),
  enableMLFeatures: z.boolean().default(true),
  maxTagsPerImage: z.number().int().min(1).default(5),
  analysisMode: z.string().default("standard"),
  allowedModels: z.array(z.string()).default(["default"]),
  customSettings: z.record(z.any()).optional(),
  updatedBy: z.string().optional(),
  version: z.number().int().default(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateMLConfigurationSchema = MLConfigurationSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateMLConfigurationSchema = MLConfigurationSchema.partial().omit(
  {
    createdAt: true,
    updatedAt: true,
    id: true, // usually you don't update the id
  },
);

export type MLConfiguration = z.infer<typeof MLConfigurationSchema>;
export type CreateMLConfigurationInput = z.infer<
  typeof CreateMLConfigurationSchema
>;
export type UpdateMLConfigurationInput = z.infer<
  typeof UpdateMLConfigurationSchema
>;
