import express from 'express';
import { authenticate, authorizeRole } from '../middlewares/jwt';
import { APP_LABELS } from '@/const/labels.const';
import { validateRequest } from '../middlewares/validateRequest';
import { BookingIdParamSchema, CheckAvailabilityQuerySchema, CreateBookingSchema, GetBookingsQuerySchema } from '@/validation/booking.schema';
import { ServiceIdParamsSchema } from '@/validation/service.schema';
import { bookingController as controller } from '../controllers/bookingController';

export const bookingRouter = express.Router();

bookingRouter.use(authenticate);
bookingRouter.use(authorizeRole(APP_LABELS.USER));

/**
 * @openapi
 * /api/v1/bookings/{serviceId}/create:
 *   post:
 *     summary: Create booking for a service
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       200:
 *         description: Booking created successfully
 *       400:
 *         description: Booking failed or validation error
 */
bookingRouter.post(
    '/:serviceId/create',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    validateRequest(CreateBookingSchema),
    controller.createBooking
);

/**
 * @openapi
 * /api/v1/bookings/{bookingId}:
 *   get:
 *     summary: Get booking details
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       404:
 *         description: Booking not found
 */
bookingRouter.get(
    '/:bookingId',
    validateRequest(BookingIdParamSchema, APP_LABELS.PARAM),
    controller.getBooking
);

/**
 * @openapi
 * /api/v1/bookings:
 *   get:
 *     summary: Get user bookings
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookings fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingListResponse'
 */
bookingRouter.get(
    '/',
    validateRequest(GetBookingsQuerySchema, APP_LABELS.QUERY),
    controller.getBookings
);

/**
 * @openapi
 * /api/v1/bookings/{bookingId}/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Cancellation failed
 */
bookingRouter.post(
    '/:bookingId/cancel',
    validateRequest(BookingIdParamSchema, APP_LABELS.PARAM),
    controller.cancelBooking
)

/**
 * @openapi
 * /api/v1/bookings/{serviceId}/checkAvailability:
 *   get:
 *     summary: Check service availability for date range
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Availability checked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckAvailabilityResponse'
 */
bookingRouter.get(
    '/:serviceId/checkAvailability',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    validateRequest(CheckAvailabilityQuerySchema, APP_LABELS.QUERY),
    controller.checkAvailability
)