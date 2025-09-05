import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
// Server-side environment variables
export const serverEnvSchema = {
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
};
// Client-side environment variables (empty for now, add as needed)
export const clientEnvSchema = {
// Add client-side environment variables here with NEXT_PUBLIC_ prefix
};
// Runtime environment variables (for client-side)
const runtimeEnv = {
// Add any runtime environment variables here
};
export const env = createEnv({
    server: serverEnvSchema,
    client: clientEnvSchema,
    experimental__runtimeEnv: runtimeEnv,
    skipValidation: process.env.NODE_ENV === 'development' ||
        !!process.env.SKIP_ENV_VALIDATION ||
        process.env.npm_lifecycle_event === "lint" ||
        process.env.npm_lifecycle_event === "check"
});
// Log environment variables in development for debugging
if (process.env.NODE_ENV !== 'production') {
    console.log('Auth Environment Variables:', {
        NODE_ENV: process.env.NODE_ENV,
        AUTH_SECRET: process.env.AUTH_SECRET ? '***' : 'Not set',
        JWT_SECRET: process.env.JWT_SECRET ? '***' : 'Not set',
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? '***' : 'Not set',
    });
}
