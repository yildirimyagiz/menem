import createJiti from "jiti";
import { fileURLToPath } from "url";
import createNextIntlPlugin from 'next-intl/plugin';

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@reservatior/api",
    "@reservatior/auth",
    "@reservatior/db",
    "@reservatior/ui",
    "@reservatior/validators",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },

  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "@auth/prisma-adapter",
    ],
    optimizeCss: false,
    optimizePackageImports: [
      "@reservatior/ui",
      "@headlessui/react",
      "@heroicons/react",
      "lucide-react",
    ],
  },

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Hybrid approach: Keep dynamic features but optimize for mobile
  output: undefined, // Keep default hybrid approach
  trailingSlash: false,
  distDir: ".next",

  // CORS headers for mobile API access
  async headers() {
    return [
      {
        // Apply these headers to all routes under /api/ (e.g., /api/trpc/*, /api/auth/*)
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins for mobile apps
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Platform, X-App-Version",
          },
        ],
      },
      {
        // Apply these headers specifically to routes under /apiauth/
        // This covers the custom auth path you might be using
        source: "/apiauth/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins for mobile apps
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Platform, X-App-Version",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(config);
