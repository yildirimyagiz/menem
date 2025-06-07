import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  propertyType: z.string().min(1, { message: "Please select a property type" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  bedrooms: z.coerce.number().int().positive({ message: "Number of bedrooms is required" }),
  bathrooms: z.coerce.number().positive({ message: "Number of bathrooms is required" }),
  squareFeet: z.coerce.number().int().positive({ message: "Square footage is required" }),
  yearBuilt: z.coerce.number().int().positive().lte(new Date().getFullYear(), { message: "Year cannot be in the future" }),
  availableFrom: z.string().min(1, { message: "Availability date is required" }),
  petFriendly: z.boolean().default(false),
  furnished: z.boolean().default(false),
  parking: z.string().optional(),
  laundry: z.string().optional(),
  airConditioning: z.boolean().default(false),
  heating: z.string().default("") ,
  amenities: z.array(z.string()).optional(),
  images: z.array(z.instanceof(File).or(z.object({ url: z.string(), alt: z.string() }))).optional(),
  coordinates: z.object({ lat: z.number().optional(), lng: z.number().optional() }).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
