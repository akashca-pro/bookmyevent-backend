
import {  z } from 'zod';

export const CreateBookingSchema = z.object({
    startDate : z.coerce
    .date('Start date is required')
    .refine((d) => !isNaN(d.getTime()), "Start date must be a valid date"),
    endDate : z.coerce
    .date('End date is required')
    .refine((d) => !isNaN(d.getTime()), "End date must be a valid date"),
})

export const BookingIdParamSchema = z.object({
    bookingId : z.string('Booking id is required')
})

export const GetBookingsQuerySchema = z.object({
    page: z.coerce
    .number( "Page must be a number")
    .int()
    .min(1, "Page must be at least 1")
    .default(1),
    limit: z.coerce
    .number('Limit must be a number')
    .int(),
    skip: z.coerce
    .number('Skip must be a number')
    .int(),
    sort : z
    .string()
    .trim()
    .optional(),
})

export const CheckAvailabilityQuerySchema = z.object({
    startDate : z.coerce
    .date('Start date is required')
    .refine((d) => !isNaN(d.getTime()), "Start date must be a valid date"),
    endDate : z.coerce
    .date('End date is required')
    .refine((d) => !isNaN(d.getTime()), "End date must be a valid date"),
})