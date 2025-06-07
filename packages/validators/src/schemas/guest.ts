import { z } from "zod";

// Enums
export const GenderEnum = z.enum(["MALE", "FEMALE"]);
export type Gender = z.infer<typeof GenderEnum>;

// Base schemas
const BaseGuestSchema = {
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  image: z.string().url("Invalid image URL").nullable().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  gender: GenderEnum,
  birthDate: z.date({
    required_error: "Birth date is required",
    invalid_type_error: "Invalid date format",
  }),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  email: z.string().email("Invalid email address"),
  agencyId: z.string().uuid("Invalid agency ID").nullable().optional(),
};

// Guest Schema
export const GuestSchema = z
  .object({
    id: z.string().uuid("Invalid ID format"),
    ...BaseGuestSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),

    // Relations
    Agency: z.record(z.any()).nullable().optional(),
    Property: z.array(z.record(z.any())).optional(),
    Reservation: z.array(z.record(z.any())).optional(),
  })
  .strict();

// Create Guest Schema
export const CreateGuestSchema = z
  .object({
    ...BaseGuestSchema,
    birthDate: z
      .union([
        z.date(),
        z
          .string()
          .datetime()
          .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
      ])
      .pipe(z.coerce.date()),
    image: z.string().url("Invalid image URL").nullable().optional(),
    agencyId: z.string().uuid("Invalid agency ID").nullable().optional(),
  })
  .strict();

// Update Guest Schema
export const UpdateGuestSchema = z
  .object({
    id: z.string().uuid("Invalid ID format"),
    name: BaseGuestSchema.name.optional(),
    phone: BaseGuestSchema.phone.optional(),
    image: BaseGuestSchema.image,
    nationality: BaseGuestSchema.nationality.optional(),
    passportNumber: BaseGuestSchema.passportNumber.optional(),
    gender: GenderEnum.optional(),
    birthDate: z
      .union([
        z.date(),
        z
          .string()
          .datetime()
          .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
      ])
      .pipe(z.coerce.date())
      .optional(),
    address: BaseGuestSchema.address.optional(),
    city: BaseGuestSchema.city.optional(),
    country: BaseGuestSchema.country.optional(),
    zipCode: BaseGuestSchema.zipCode.optional(),
    email: BaseGuestSchema.email.optional(),
    agencyId: BaseGuestSchema.agencyId,
    deletedAt: z.date().nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field must be provided for update",
  });

// Guest Filter Schema
export const GuestFilterSchema = z
  .object({
    // Text search
    search: z.string().optional(),

    // Exact match filters
    name: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    passportNumber: z.string().optional(),
    nationality: z.string().optional(),
    gender: GenderEnum.optional(),
    agencyId: z.string().uuid("Invalid agency ID").optional(),

    // Date range
    createdAtFrom: z.date().optional(),
    createdAtTo: z.date().optional(),

    // Sorting
    sortBy: z
      .enum(["createdAt", "updatedAt", "name", "email"])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),

    // Pagination
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
  })
  .strict();

// Zod Type Inference for TypeScript
export type Guest = z.infer<typeof GuestSchema>;
export type CreateGuestInput = z.infer<typeof CreateGuestSchema>;
export type UpdateGuestInput = z.infer<typeof UpdateGuestSchema>;
export type GuestFilterInput = z.infer<typeof GuestFilterSchema>;
