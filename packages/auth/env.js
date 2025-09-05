import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
// Define the environment variables schema
export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "production"]).default("development"),
        AUTH_SECRET: z.string().min(1),
        JWT_SECRET: z.string().min(1),
        AUTH_GOOGLE_ID: z.string().min(1),
        AUTH_GOOGLE_SECRET: z.string().min(1),
    },
    client: {
    // Client-side environment variables (prefixed with NEXT_PUBLIC_)
    },
    experimental__runtimeEnv: {
    // Client-side environment variables that should be available on the client
    },
    skipValidation: process.env.NODE_ENV !== 'production' ||
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
