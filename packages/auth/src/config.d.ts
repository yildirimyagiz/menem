import type { DefaultSession, Session as NextAuthSession } from "next-auth";
import { skipCSRFCheck } from "@auth/core";
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
export declare const isSecureContext: boolean;
export declare const authConfig: {
    secret: string | undefined;
    providers: import("@auth/core/providers").OAuthConfig<any>[];
    callbacks: {
        session: (opts: {
            session: {
                user: import("next-auth/adapters").AdapterUser;
            } & import("next-auth/adapters").AdapterSession;
            user: import("next-auth/adapters").AdapterUser;
        } & {
            session: NextAuthSession;
            token: import("@auth/core/jwt").JWT;
        } & {
            newSession: any;
            trigger?: "update";
        }) => {
            user: {
                id: string;
                email: string;
                emailVerified: Date | null;
                name?: string | null;
                image?: string | null;
            };
            sessionToken: string;
            userId: string;
            expires: Date & string;
        };
    };
    skipCSRFCheck?: typeof skipCSRFCheck | undefined;
    trustHost?: true | undefined;
    adapter: import("next-auth/adapters").Adapter;
};
export declare const validateToken: (token: string) => Promise<NextAuthSession | null>;
export declare const invalidateSessionToken: (token: string) => Promise<void>;
