import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";

import { createContext } from "./context";
import { appRouter } from "./root";
import { scheduledReportService } from "./services/scheduledReports";

const prisma = new PrismaClient();

const port = process.env.PORT ? parseInt(process.env.PORT) : 2998;
const secondaryPort = process.env.SECONDARY_PORT
  ? parseInt(process.env.SECONDARY_PORT)
  : undefined;
const wsPort = process.env.NEXT_PUBLIC_WS_URL
  ? (() => {
      try {
        const url = new URL(process.env.NEXT_PUBLIC_WS_URL);
        return url.port ? parseInt(url.port) : 2998;
      } catch {
        return parseInt(process.env.NEXT_PUBLIC_WS_URL) || 2998;
      }
    })()
  : 2998;

// Create a tRPC router with the database status check
const dbStatusRouter = {
  dbStatus: async () => {
    try {
      await prisma.$connect();
      return { status: "Connected to the database" };
    } catch (error) {
      throw new Error(
        `Failed to connect to the database: ${(error as Error).message}`,
      );
    } finally {
      await prisma.$disconnect();
    }
  },
};

// Combine the dbStatusRouter with your existing appRouter
const combinedRouter = {
  ...appRouter,
  ...dbStatusRouter,
};

// Start HTTP server (for queries/mutations)
const server = createHTTPServer({
  router: combinedRouter,
  createContext,
});

server.listen(port);
console.log(`HTTP Server running on port ${port}`);

// Optionally start a second HTTP server
let secondaryServer: ReturnType<typeof createHTTPServer> | undefined =
  undefined;
if (secondaryPort && secondaryPort !== port) {
  secondaryServer = createHTTPServer({
    router: combinedRouter,
    createContext,
  });
  secondaryServer.listen(secondaryPort);
  console.log(`HTTP Server also running on secondary port ${secondaryPort}`);
}

// Start tRPC WebSocket server (for subscriptions)
const wss = new WebSocketServer({ port: wsPort });
applyWSSHandler({ wss, router: combinedRouter, createContext });
console.log(`tRPC WebSocket Server running on port ${wsPort}`);

// Initialize scheduled report service
console.log("Initializing scheduled report service...");
// The service is automatically initialized when imported

// Handle graceful shutdown
const shutdown = (reason?: string | Error) => {
  if (reason) {
    console.error("Shutdown triggered:", reason);
  }
  console.log("Shutting down servers...");

  // Stop all scheduled reports
  scheduledReportService.stopAllSchedules();
  console.log("Stopped all scheduled reports");

  server.close();
  if (secondaryServer) secondaryServer.close();
  wss.close();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("exit", () => shutdown("exit"));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown(err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  shutdown(reason instanceof Error ? reason : String(reason));
});

console.log("Server startup complete. Waiting for requests...");
