import type { Prisma } from "@prisma/client";

// Define the include object for Prisma queries consistently
export const taskInclude = {
  Analytics: true,
  Mention: true,
  Agency: true,
  Agent: true,
  createdBy: true,
  assignedTo: true,
  Property: true,
  Facility: true,
  IncludedService: true,
  ExtraCharge: true,
} as const;

// Generate a precise type for Task with its relations based on the include
export type FullTaskFromPrisma = Prisma.TaskGetPayload<{
  include: typeof taskInclude;
}>;

// Utility to sanitize task data
export function sanitizeTask(task: FullTaskFromPrisma | null) {
  if (!task) return null;
  // Destructure using capitalized relation names, matching Prisma output
  const {
    Analytics,
    Mention,
    Agency,
    Agent,
    createdBy,
    assignedTo,
    Property,
    Facility,
    IncludedService,
    ExtraCharge,
    ...rest
  } = task;
  return {
    ...rest,
    Analytics,
    Mention,
    Agency,
    Agent,
    createdBy,
    assignedTo,
    Property,
    Facility,
    IncludedService,
    ExtraCharge,
  };
}
