
import {  z } from 'zod';
import { SortSchema } from './helpers.schema';

export const CreateBookingSchema = z.object({
    startDate : z.coerce
    .date('Start date is required')
    .refine((d) => !isNaN(d.getTime()), "Start date must be a valid date"),
    endDate : z.coerce
    .date('End date is required')
    .refine((d) => !isNaN(d.getTime()), "End date must be a valid date"),
})

export const ReserveBookingParamSchema = z.object({
    serviceId : z.string('Service id is required'),
    bookingId : z.string('Booking id is required')
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
    sort : SortSchema,
    status : z.string('Status is required').optional()
})

export const CheckAvailabilityQuerySchema = z.object({
    startDate : z.coerce
    .date('Start date is required')
    .refine((d) => !isNaN(d.getTime()), "Start date must be a valid date"),
    endDate : z.coerce
    .date('End date is required')
    .refine((d) => !isNaN(d.getTime()), "End date must be a valid date"),
})

export const GetMonthlyAvailabilitySchema = z.object({
    month : z.coerce
    .number('Month must be a number')
    .int()
    .min(1, "Month must be at least 1")
    .max(12, "Month must be at most 12"),
    year : z.coerce
    .number('Year must be a number')
    .int()
    .min(2025, "Year must be at least 2025")
    .max(new Date().getFullYear(), "Year must be at most current year")
})