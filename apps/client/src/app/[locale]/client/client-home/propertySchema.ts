import type { CreatePropertyInput } from "~/../../packages/validators/src/schemas/property";
import { CreatePropertySchema } from "~/../../packages/validators/src/schemas/property";

export const propertySchema = CreatePropertySchema;
export type PropertyFormValues = CreatePropertyInput;
