/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { Session } from "@reservatior/auth";
import { validateToken } from "@reservatior/auth";
import { db } from "@reservatior/db";

// Extend the session user type to include role and agencyId
export interface ExtendedUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
  agencyId?: string | null;
}

export interface ExtendedSession extends Session {
  user: ExtendedUser;
}

/**
 * Isomorphic Session getter for API requests
 * - Mobile app requests will have a session token in the Authorization header
 * - Next.js requests will have a session token in cookies
 */
const isomorphicGetSession = async (
  headers: Headers,
): Promise<ExtendedSession | null> => {
  let authToken = headers.get("Authorization") ?? null;
  console.log("[isomorphicGetSession] Incoming Authorization:", authToken);
  try {
    if (authToken) {
      // Strip 'Bearer ' prefix if present for JWT tokens
      if (authToken.startsWith("Bearer ")) {
        authToken = authToken.slice(7);
      }
      const maybeSession = await validateToken(authToken);
      console.log("[isomorphicGetSession] validateToken result:", maybeSession);
      if (maybeSession && "user" in maybeSession) {
        return maybeSession as ExtendedSession;
      }
      return null;
    }
    // In a pure Node/tRPC context, we cannot retrieve a session from cookies like NextAuth does in Next.js.
    // Only JWT-based authentication via Authorization header is supported here.
    return null;
  } catch (err) {
    console.warn("Session retrieval failed", err);
    return null;
  }
};

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  session?: ExtendedSession | null;
}) => {
  const authToken = opts.headers.get("Authorization") ?? null;
  console.log("[createTRPCContext] Incoming Authorization:", authToken);
  let session = opts.session;
  // If session is undefined, try to get it from headers (for SSR/API calls)
  if (typeof session === "undefined") {
    session = await isomorphicGetSession(opts.headers);
  }
  // Defensive: ensure session is object or null
  if (session && typeof session !== "object") {
    console.warn(
      "[tRPC] Invalid session type in context, forcing to null",
      session,
    );
    session = null;
  }
  const source = opts.headers.get("x-trpc-source") ?? "unknown";
  if (session && typeof session === "object" && "user" in session) {
    console.log(">>> tRPC Request from", source, "by", session.user);
  } else {
    console.log(">>> tRPC Request from", source, "by", undefined);
  }
  return {
    session: session ?? null,
    db,
    token: authToken,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !("user" in ctx.session)) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

/**
 * Role-based authorization middleware
 * Ensures user has the required role(s) to access the resource
 */
export const requireRole = (allowedRoles: string[]) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const userRole = ctx.session.user.role ?? "USER";
    if (!allowedRoles.includes(userRole)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        userRole,
      },
    });
  });

/**
 * Agency-based authorization middleware
 * Ensures user can only access resources within their agency
 */
export const requireAgencyAccess = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = ctx.session.user;
  const userRole = user.role ?? "USER";

  // Super admins and admins can access everything
  if (["SUPER_ADMIN", "ADMIN"].includes(userRole)) {
    return next({
      ctx: {
        ...ctx,
        userRole,
        agencyId: null, // No agency restriction for admins
      },
    });
  }

  // Get user's agency ID
  let agencyId: string | null = null;

  if (user.agencyId) {
    agencyId = user.agencyId;
  } else if (
    ["AGENCY", "AGENCY_ADMIN", "AGENT", "AGENT_ADMIN"].includes(userRole)
  ) {
    // For agency-related roles, get agency from user record
    const userRecord = await ctx.db.user.findUnique({
      where: { id: user.id },
      select: { agencyId: true },
    });
    agencyId = userRecord?.agencyId ?? null;
  }

  return next({
    ctx: {
      ...ctx,
      userRole,
      agencyId,
    },
  });
});

/**
 * Property ownership authorization middleware
 * Ensures user can only access properties they own, manage, or are assigned to
 */
export const requirePropertyAccess = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = ctx.session.user;
  const userRole = user.role ?? "USER";

  // Super admins and admins can access everything
  if (["SUPER_ADMIN", "ADMIN"].includes(userRole)) {
    return next({
      ctx: {
        ...ctx,
        userRole,
        canAccessAllProperties: true,
      },
    });
  }

  // Get user's relationships
  const userRecord = await ctx.db.user.findUnique({
    where: { id: user.id },
    select: {
      agencyId: true,
      Agent: {
        select: {
          id: true,
          agencyId: true,
        },
      },
    },
  });

  const agencyId = userRecord?.agencyId;
  const agentId = userRecord?.Agent?.[0]?.id;

  return next({
    ctx: {
      ...ctx,
      userRole,
      agencyId,
      agentId,
      canAccessAllProperties: false,
    },
  });
});

/**
 * Agent authorization middleware
 * Ensures user can only access agents within their agency or their own profile
 */
export const requireAgentAccess = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = ctx.session.user;
  const userRole = user.role ?? "USER";

  // Super admins and admins can access everything
  if (["SUPER_ADMIN", "ADMIN"].includes(userRole)) {
    return next({
      ctx: {
        ...ctx,
        userRole,
        canAccessAllAgents: true,
      },
    });
  }

  // Get user's relationships
  const userRecord = await ctx.db.user.findUnique({
    where: { id: user.id },
    select: {
      agencyId: true,
      Agent: {
        select: {
          id: true,
          agencyId: true,
        },
      },
    },
  });

  const agencyId = userRecord?.agencyId;
  const agentId = userRecord?.Agent?.[0]?.id;

  return next({
    ctx: {
      ...ctx,
      userRole,
      agencyId,
      agentId,
      canAccessAllAgents: false,
    },
  });
});

/**
 * Procedures with role-based access control
 */
export const adminProcedure = protectedProcedure.use(
  requireRole(["SUPER_ADMIN", "ADMIN"]),
);
export const agencyProcedure = protectedProcedure.use(
  requireRole(["AGENCY", "AGENCY_ADMIN", "AGENT", "AGENT_ADMIN"]),
);
export const agentProcedure = protectedProcedure.use(
  requireRole(["AGENT", "AGENT_ADMIN"]),
);

/**
 * Procedures with agency-based filtering
 */
export const agencyFilteredProcedure =
  protectedProcedure.use(requireAgencyAccess);
export const propertyFilteredProcedure = protectedProcedure.use(
  requirePropertyAccess,
);
export const agentFilteredProcedure =
  protectedProcedure.use(requireAgentAccess);
