export type { Session } from "next-auth";
export declare const handlers: {
    GET: (req: import("next/server").NextRequest) => Promise<Response>;
    POST: (req: import("next/server").NextRequest) => Promise<Response>;
};
export declare const signIn: <P extends import("@auth/core/providers").BuiltInProviderType | (string & {}), R extends boolean = true>(provider?: P, options?: FormData | ({
    redirectTo?: string;
    redirect?: R;
} & Record<string, any>), authorizationParams?: string[][] | Record<string, string> | string | URLSearchParams) => Promise<R extends false ? any : never>;
export declare const signOut: <R extends boolean = true>(options?: {
    redirectTo?: string;
    redirect?: R;
}) => Promise<R extends false ? any : never>;
export declare const auth: unknown;
export { invalidateSessionToken, validateToken, isSecureContext, } from "./config";
