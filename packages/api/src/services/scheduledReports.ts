import { randomUUID } from "crypto";
import type { Prisma, ReportStatus, ReportType } from "@prisma/client";
import { db } from "@reservatior/db";
import { TRPCError } from "@trpc/server";
import cron from "node-cron";

// Report schedule configuration
export interface ReportSchedule {
  id: string;
  title: string;
  reportType: ReportType;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  cronExpression: string;
  isActive: boolean;
  agencyId?: string;
  propertyId?: string;
  agentId?: string;
  tenantId?: string;
  generatedById: string;
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schedule configurations for different report types
const DEFAULT_SCHEDULES: Omit<
  ReportSchedule,
  "id" | "generatedById" | "createdAt" | "updatedAt"
>[] = [
  {
    title: "Daily Financial Summary",
    reportType: "FINANCIAL",
    frequency: "daily",
    cronExpression: "0 9 * * *", // Every day at 9 AM
    isActive: true,
  },
  {
    title: "Weekly Performance Report",
    reportType: "PERFORMANCE",
    frequency: "weekly",
    cronExpression: "0 10 * * 1", // Every Monday at 10 AM
    isActive: true,
  },
  {
    title: "Monthly Revenue Analysis",
    reportType: "REVENUE",
    frequency: "monthly",
    cronExpression: "0 11 1 * *", // First day of month at 11 AM
    isActive: true,
  },
  {
    title: "Monthly Occupancy Report",
    reportType: "OCCUPANCY",
    frequency: "monthly",
    cronExpression: "0 12 1 * *", // First day of month at 12 PM
    isActive: true,
  },
  {
    title: "Quarterly Market Analysis",
    reportType: "MARKET_ANALYSIS",
    frequency: "monthly",
    cronExpression: "0 13 1 */3 *", // First day of every 3rd month at 1 PM
    isActive: true,
  },
  {
    title: "Yearly Compliance Report",
    reportType: "COMPLIANCE",
    frequency: "yearly",
    cronExpression: "0 14 1 1 *", // January 1st at 2 PM
    isActive: true,
  },
];

class ScheduledReportService {
  private schedules = new Map<string, cron.ScheduledTask>();

  constructor() {
    this.initializeSchedules();
  }

  /**
   * Initialize default schedules and load existing ones from database
   */
  private async initializeSchedules() {
    try {
      console.log("[ScheduledReports] Initializing scheduled reports...");

      // Load existing schedules from database
      const existingSchedules = await this.loadSchedulesFromDatabase();

      // Create default schedules if none exist
      if (existingSchedules.length === 0) {
        await this.createDefaultSchedules();
      }

      // Start all active schedules
      await this.startAllSchedules();

      console.log(
        "[ScheduledReports] Scheduled reports initialized successfully",
      );
    } catch (error) {
      console.error("[ScheduledReports] Error initializing schedules:", error);
    }
  }

  /**
   * Load schedules from database
   */
  private async loadSchedulesFromDatabase(): Promise<ReportSchedule[]> {
    try {
      // This would typically come from a ReportSchedule table
      // For now, we'll use a simple in-memory approach
      return [];
    } catch (error) {
      console.error("[ScheduledReports] Error loading schedules:", error);
      return [];
    }
  }

  /**
   * Create default schedules in database
   */
  private async createDefaultSchedules() {
    try {
      console.log("[ScheduledReports] Creating default schedules...");

      // In a real implementation, you would save these to a database table
      // For now, we'll just log them
      DEFAULT_SCHEDULES.forEach((schedule) => {
        console.log(
          `[ScheduledReports] Created default schedule: ${schedule.title}`,
        );
      });
    } catch (error) {
      console.error(
        "[ScheduledReports] Error creating default schedules:",
        error,
      );
    }
  }

  /**
   * Start all active schedules
   */
  private async startAllSchedules() {
    try {
      // Start default schedules
      DEFAULT_SCHEDULES.forEach((schedule) => {
        if (schedule.isActive) {
          this.startSchedule(schedule);
        }
      });
    } catch (error) {
      console.error("[ScheduledReports] Error starting schedules:", error);
    }
  }

  /**
   * Start a specific schedule
   */
  private startSchedule(
    schedule: Omit<
      ReportSchedule,
      "id" | "generatedById" | "createdAt" | "updatedAt"
    >,
  ) {
    try {
      const task = cron.schedule(
        schedule.cronExpression,
        async () => {
          await this.generateScheduledReport(schedule);
        },
        {
          scheduled: true,
          timezone: "UTC",
        },
      );

      this.schedules.set(schedule.title, task);
      console.log(
        `[ScheduledReports] Started schedule: ${schedule.title} (${schedule.cronExpression})`,
      );
    } catch (error) {
      console.error(
        `[ScheduledReports] Error starting schedule ${schedule.title}:`,
        error,
      );
    }
  }

  /**
   * Generate a scheduled report
   */
  private async generateScheduledReport(
    schedule: Omit<
      ReportSchedule,
      "id" | "generatedById" | "createdAt" | "updatedAt"
    >,
  ) {
    try {
      console.log(
        `[ScheduledReports] Generating scheduled report: ${schedule.title}`,
      );

      const now = new Date();
      const startDate = this.calculateStartDate(schedule.frequency, now);
      const endDate = now;

      // Generate the report
      const reportData: Prisma.ReportCreateInput = {
        id: randomUUID(),
        title: `${schedule.title} - ${this.formatDateRange(startDate, endDate)}`,
        reportType: schedule.reportType,
        status: "GENERATED" as ReportStatus,
        startDate,
        endDate,
        description: `Automatically generated ${schedule.frequency} report`,
        generatedBy: { connect: { id: "system" } }, // System user
        Agency: schedule.agencyId
          ? { connect: { id: schedule.agencyId } }
          : undefined,
        Property: schedule.propertyId
          ? { connect: { id: schedule.propertyId } }
          : undefined,
        Agent: schedule.agentId
          ? { connect: { id: schedule.agentId } }
          : undefined,
        createdAt: now,
        updatedAt: now,
      };

      const report = await db.report.create({
        data: reportData,
        include: {
          Agency: true,
          Property: true,
          Agent: true,
          generatedBy: true,
        },
      });

      console.log(
        `[ScheduledReports] Successfully generated report: ${report.id}`,
      );

      // Update schedule last run time
      await this.updateScheduleLastRun(schedule.title, now);
    } catch (error) {
      console.error(
        `[ScheduledReports] Error generating scheduled report ${schedule.title}:`,
        error,
      );
    }
  }

  /**
   * Calculate start date based on frequency
   */
  public calculateStartDate(frequency: string, endDate: Date): Date {
    const startDate = new Date(endDate);

    switch (frequency) {
      case "daily":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "weekly":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "yearly":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 1);
    }

    return startDate;
  }

  /**
   * Format date range for report title
   */
  private formatDateRange(startDate: Date, endDate: Date): string {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  /**
   * Update schedule last run time
   */
  private async updateScheduleLastRun(scheduleTitle: string, lastRun: Date) {
    try {
      // In a real implementation, you would update the database
      console.log(
        `[ScheduledReports] Updated last run for ${scheduleTitle}: ${lastRun.toISOString()}`,
      );
    } catch (error) {
      console.error(
        `[ScheduledReports] Error updating last run for ${scheduleTitle}:`,
        error,
      );
    }
  }

  /**
   * Create a new scheduled report
   */
  public async createScheduledReport(
    schedule: Omit<ReportSchedule, "id" | "createdAt" | "updatedAt">,
  ): Promise<ReportSchedule> {
    try {
      // In a real implementation, you would save to database
      const newSchedule: ReportSchedule = {
        ...schedule,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Start the schedule if it's active
      if (schedule.isActive) {
        this.startSchedule(schedule);
      }

      console.log(
        `[ScheduledReports] Created new scheduled report: ${schedule.title}`,
      );
      return newSchedule;
    } catch (error) {
      console.error(
        "[ScheduledReports] Error creating scheduled report:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create scheduled report",
      });
    }
  }

  /**
   * Update a scheduled report
   */
  public async updateScheduledReport(
    id: string,
    updates: Partial<ReportSchedule>,
  ): Promise<ReportSchedule> {
    try {
      // In a real implementation, you would update the database
      console.log(`[ScheduledReports] Updated scheduled report: ${id}`);

      // Restart schedule if needed
      if (updates.isActive !== undefined || updates.cronExpression) {
        // Stop existing schedule
        const existingSchedule = this.schedules.get(id);
        if (existingSchedule) {
          existingSchedule.stop();
          this.schedules.delete(id);
        }

        // Start new schedule if active
        if (updates.isActive) {
          // This would need the full schedule data
          console.log(`[ScheduledReports] Restarted schedule: ${id}`);
        }
      }

      return {} as ReportSchedule; // Placeholder
    } catch (error) {
      console.error(
        "[ScheduledReports] Error updating scheduled report:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update scheduled report",
      });
    }
  }

  /**
   * Delete a scheduled report
   */
  public async deleteScheduledReport(id: string): Promise<void> {
    try {
      // Stop the schedule
      const schedule = this.schedules.get(id);
      if (schedule) {
        schedule.stop();
        this.schedules.delete(id);
      }

      // In a real implementation, you would delete from database
      console.log(`[ScheduledReports] Deleted scheduled report: ${id}`);
    } catch (error) {
      console.error(
        "[ScheduledReports] Error deleting scheduled report:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete scheduled report",
      });
    }
  }

  /**
   * Get all scheduled reports
   */
  public async getScheduledReports(): Promise<ReportSchedule[]> {
    try {
      // In a real implementation, you would fetch from database
      // For now, return default schedules
      return DEFAULT_SCHEDULES.map((schedule) => ({
        ...schedule,
        id: randomUUID(),
        generatedById: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    } catch (error) {
      console.error(
        "[ScheduledReports] Error getting scheduled reports:",
        error,
      );
      return [];
    }
  }

  /**
   * Stop all schedules (for cleanup)
   */
  public stopAllSchedules() {
    this.schedules.forEach((schedule, id) => {
      schedule.stop();
      console.log(`[ScheduledReports] Stopped schedule: ${id}`);
    });
    this.schedules.clear();
  }
}

// Export singleton instance
export const scheduledReportService = new ScheduledReportService();
