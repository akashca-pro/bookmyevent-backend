import {  z } from 'zod';

export const StrictString = (fieldName: string = "Field") => z
    .string(`${fieldName} is required.`)
    .trim()
    .min(1,`${fieldName} cannot be empty.`)
    .regex(
        /^(?!.*['-]{2,})(?!.* {2,})(?!.*[.,]{2,})[a-zA-Z0-9 .,'-]+$/,
        `${fieldName} contains invalid characters or has consecutive spaces, punctuation, apostrophes, or hyphens.`
    );

export const LocationSchema = z
  .object({
    address: StrictString("Address")
      .trim()
      .min(5, "Address must be at least 5 characters long")
      .max(200, "Address must not exceed 200 characters"),

    city: StrictString("City")
      .trim()
      .min(2, "City must be at least 2 characters long")
      .max(100, "City must not exceed 100 characters"),

    pincode: z
      .string("Pincode is required")
      .regex(/^\d{6}$/, "Pincode must be a valid 6‑digit Indian postal code"),
  })
  .strict();
    
export const AvailabilitySchema = z
  .object({
    from: z.coerce
      .date("Start date is required")
      .refine((d) => !isNaN(d.getTime()), "Start date must be a valid date"),

    to: z.coerce
      .date("End date is required")
      .refine((d) => !isNaN(d.getTime()), "End date must be a valid date"),
  })
  .strict()
  .refine(
    (data) => data.to >= data.from,
    "End date must be greater than or equal to start date"
);
    
export const ContactSchema = z.object({
    phone: z
    .string('Phone number is required')
    .regex(
    /^[6-9]\d{9}$/,
    "Phone number must be a valid 10‑digit Indian mobile number starting with 6, 7, 8, or 9"
    ),

    email: z
    .email('Invalid email address')
    .min(5, "Email must be at least 5 characters long")
    .max(255, "Email must not exceed 255 characters"),
}).strict();

export const ServieFilterSchema = z.object({
    category: StrictString().optional(),
    minPrice: z.coerce.number('Min price must be a number').int().optional(),
    maxPrice: z.coerce.number('Max price must be a number').int().optional(),
    city: StrictString().optional(),
    adminId: z.string().optional(),
})
    
export const ListOptionsQuerySchema = z.object({
    page: z.coerce
    .number( "Page must be a number")
    .int()
    .min(1, "Page must be at least 1")
    .optional(),

    limit: z.coerce
    .number('Limit must be a number')
    .int()
    .optional(), 
    
    sort : z
    .string()
    .trim()
    .optional(),
})