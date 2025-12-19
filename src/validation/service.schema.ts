import {  z } from 'zod';
import { AvailabilitySchema, ContactSchema, LocationSchema, SortSchema, StrictString } from './helpers.schema';

export const CreateServiceSchema = z.object({
    title : StrictString('Title')
    .trim()
    .min(3,'Title must be atleast 5 characters long')
    .max(100,'Title must not exceed 100 characters'),
    description: z
    .string('Description')
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters"),
    category: StrictString('category'),
    pricePerDay: z.coerce
      .number( "PricePerDay must be a number")
      .int()
      .min(1, "PricePerDay must be at least 1")
      .default(1),
    location: LocationSchema,
    availability: AvailabilitySchema,
    contact: ContactSchema,
}).strict();

export const ServiceIdParamsSchema = z.object({
    serviceId : z.string('Service Id is required')
})

export const UpdateServiceSchema = z.object({
    title : StrictString('Title')
    .trim()
    .min(3,'Title must be atleast 5 characters long')
    .max(100,'Title must not exceed 100 characters')
    .optional(),
    description: z
    .string('Description')
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),
    category: StrictString('category').optional(),
    pricePerDay: z.coerce
      .number( "PricePerDay must be a number")
      .int()
      .min(1, "PricePerDay must be at least 1")
      .default(1)
      .optional(),
    
    location: LocationSchema.optional(),
    availability: AvailabilitySchema.optional(),
    contact: ContactSchema.optional(),
    isArchived : z.preprocess(
      (val) => {
        if (typeof val === "string") {
          if (val.toLowerCase() === "false") return false;
          if (val.toLowerCase() === "true") return true;
        }
        return val;
      },
      z.boolean('isArchived must be boolean').optional()
    ),
    isActive : z.preprocess(
      (val) => {
        if (typeof val === "string") {
          if (val.toLowerCase() === "false") return false;
          if (val.toLowerCase() === "true") return true;
        }
        return val;
      },
      z.boolean('isArchived must be boolean').optional()
    ),
})

export const GetServicesQuerySchema = z.object({
  page: z.coerce
    .number( "Page must be a number")
    .int()
    .min(1, "Page must be at least 1")
    .default(1),
  category: StrictString().optional(),
  minPrice: z.coerce.number('Min price must be a number').int().optional(),
  maxPrice: z.coerce.number('Max price must be a number').int().optional(),
  municipality: StrictString().optional(),
  district : StrictString().optional(),
  adminId: z.string().optional(),
  limit: z.coerce
  .number('Limit must be a number')
  .int(),
  sort : z
  .string()
  .trim()
  .optional(),
  search : z
  .string()
  .trim()
  .optional()
})

export const GetAvailableServicesQuerySchema = z.object({
    startDate : z.coerce
    .date('Start date is required')
    .refine((d) => !isNaN(d.getTime()), "Start date must be a valid date"),
    endDate : z.coerce
    .date('End date is required')
    .refine((d) => !isNaN(d.getTime()), "End date must be a valid date"),
    page: z.coerce
      .number( "Page must be a number")
      .int()
      .min(1, "Page must be at least 1")
      .default(1),
    category: StrictString().optional(),
    minPrice: z.coerce.number('Min price must be a number').int().optional(),
    maxPrice: z.coerce.number('Max price must be a number').int().optional(),
    municipality: StrictString().optional(),
    district: StrictString().optional(),
    adminId: z.string().optional(),
    limit: z.coerce
    .number('Limit must be a number')
    .int(),
    sort : z
    .string()
    .trim()
    .optional(),
    search : z
    .string()
    .trim()
    .optional()
})

export const GetBookingsByServicesQuerySchema = z.object({
  page: z.coerce
  .number( "Page must be a number")
  .int()
  .min(1, "Page must be at least 1")
  .optional(),
  limit: z.coerce
  .number('Limit must be a number')
  .int()
  .optional(),
  sort : SortSchema,
  status : z.string('Status is required').optional()
})