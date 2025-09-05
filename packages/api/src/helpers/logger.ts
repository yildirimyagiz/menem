import { env } from "../env";

export interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

export interface LogEntry {
  timestamp: string;
  level: keyof LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  duration?: number;
  requestId?: string;
}

class Logger {
  private logLevel: keyof LogLevel = env.NODE_ENV === "production" ? "INFO" : "DEBUG";

  private shouldLog(level: keyof LogLevel): boolean {
    const levels: LogLevel = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    const base = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;
    const context = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : "";
    const duration = entry.duration ? ` | Duration: ${entry.duration}ms` : "";
    const requestId = entry.requestId ? ` | RequestId: ${entry.requestId}` : "";
    const error = entry.error ? ` | Error: ${entry.error.message}\n${entry.error.stack}` : "";
    
    return `${base}${context}${duration}${requestId}${error}`;
  }

  debug(message: string, context?: Record<string, unknown>, requestId?: string): void {
    if (this.shouldLog("DEBUG")) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "DEBUG",
        message,
        context,
        requestId,
      };
      console.debug(this.formatLog(entry));
    }
  }

  info(message: string, context?: Record<string, unknown>, requestId?: string): void {
    if (this.shouldLog("INFO")) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "INFO",
        message,
        context,
        requestId,
      };
      console.info(this.formatLog(entry));
    }
  }

  warn(message: string, context?: Record<string, unknown>, requestId?: string): void {
    if (this.shouldLog("WARN")) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "WARN",
        message,
        context,
        requestId,
      };
      console.warn(this.formatLog(entry));
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>, requestId?: string): void {
    if (this.shouldLog("ERROR")) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "ERROR",
        message,
        context,
        error,
        requestId,
      };
      console.error(this.formatLog(entry));
    }
  }

  // Performance monitoring
  time<T>(operation: string, fn: () => Promise<T>, context?: Record<string, unknown>, requestId?: string): Promise<T> {
    const start = Date.now();
    return fn().finally(() => {
      const duration = Date.now() - start;
      this.info(`${operation} completed`, { ...context, duration }, requestId);
    });
  }

  // Request logging
  logRequest(method: string, url: string, statusCode: number, duration: number, requestId?: string): void {
    const level = statusCode >= 400 ? "ERROR" : "INFO";
    const message = `${method} ${url} - ${statusCode}`;
    const context = { method, url, statusCode, duration };
    
    if (level === "ERROR") {
      this.error(message, undefined, context, requestId);
    } else {
      this.info(message, context, requestId);
    }
  }
}

export const logger = new Logger();
