import type { MLConfiguration } from "@reservatior/validators";
import { CreateMLConfigurationSchema, UpdateMLConfigurationSchema } from "@reservatior/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

// Type guard for Prisma errors
function isPrismaError(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as any).code === "string"
  );
}

// Utility to sanitize MLConfiguration data
function sanitizeMLConfig(config: MLConfiguration | null) {
  if (!config) return null;
  return {
    id: config.id,
    enableAutoTagging: config.enableAutoTagging,
    qualityThreshold: config.qualityThreshold,
    enableMLFeatures: 'enableMLFeatures' in config ? config.enableMLFeatures : undefined,
    maxTagsPerImage: 'maxTagsPerImage' in config ? config.maxTagsPerImage : undefined,
    analysisMode: 'analysisMode' in config ? config.analysisMode : undefined,
    allowedModels: 'allowedModels' in config ? config.allowedModels : undefined,
    customSettings: 'customSettings' in config ? config.customSettings : undefined,
    updatedBy: 'updatedBy' in config ? config.updatedBy : undefined,
    version: 'version' in config ? config.version : undefined,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt,
  };
}

export const mlConfigRouter = {
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const config = await ctx.db.mLConfiguration.findUnique({
        where: { id: input.id },
      });
      return sanitizeMLConfig(config);
    }),

  create: protectedProcedure
    .input(CreateMLConfigurationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const config = await ctx.db.mLConfiguration.create({
          data: {
            ...input,
            id: "singleton",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return sanitizeMLConfig(config);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create ML configuration: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateMLConfigurationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const config = await ctx.db.mLConfiguration.update({
          where: { id: "singleton" },
          data: {
            ...input,
            updatedAt: new Date(),
          },
        });
        return sanitizeMLConfig(config);
      } catch (error: unknown) {
        if (isPrismaError(error) && error.code === "P2025") {
          throw new Error("ML Configuration not found.");
        }
        throw error;
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const config = await ctx.db.mLConfiguration.delete({
          where: { id: input },
        });
        return sanitizeMLConfig(config);
      } catch (error: unknown) {
        if (isPrismaError(error) && error.code === "P2025") {
          throw new Error("ML Configuration not found or already deleted.");
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;
