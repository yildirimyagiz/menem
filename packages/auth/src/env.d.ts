import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "test", "production"]>>;
    AUTH_SECRET: z.ZodString;
    AUTH_GOOGLE_ID: z.ZodString;
    AUTH_GOOGLE_SECRET: z.ZodString;
}, "strip", z.ZodTypeAny, {
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    AUTH_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
}, {
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    AUTH_SECRET: string;
    NODE_ENV?: "development" | "production" | "test" | undefined;
}>;
export declare const env: {
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    AUTH_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
};
