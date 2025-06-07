import { fileURLToPath } from "url";
import createJiti from "jiti";
import createNextIntlPlugin from "next-intl/plugin";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@acme/api",
    "@acme/auth",
    "@acme/db",
    "@acme/ui",
    "@acme/validators",
  ],

  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "@auth/prisma-adapter",
    ],
  },

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
      {
        // Apply these headers to all routes under /api/ (e.g., /api/trpc/*, /api/auth/*)
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          // {
          //   key: "Access-Control-Allow-Origin",
          //   value: "http://localhost:5000",
          // }, // Commented out for dynamic CORS in API handlers
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
      {
        // Apply these headers specifically to routes under /apiauth/
        // This covers the custom auth path you might be using
        source: "/apiauth/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          // {
          //   key: "Access-Control-Allow-Origin",
          //   value: "http://localhost:5000",
          // }, // Commented out for dynamic CORS in API handlers
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(config);
