import express from 'express';
import { authenticate, authorizeRole } from '../middlewares/jwt';
import { APP_LABELS } from '@/const/labels.const';
import { validateRequest } from '../middlewares/validateRequest';
import {
  BookingIdParamSchema,
  CheckAvailabilityQuerySchema,
  CreateBookingSchema,
  GetBookingsQuerySchema,
  GetMonthlyAvailabilitySchema,
} from '@/validation/booking.schema';
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
 *     tags: [Bookings]
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
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – user role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
bookingRouter.post(
  '/bookings/services/:serviceId/create',
  validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
  validateRequest(CreateBookingSchema),
  controller.createBooking
);

/**
 * @openapi
 * /api/v1/bookings/{bookingId}:
 *   get:
 *     summary: Get booking details
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking fetched
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – user role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Bookings fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBookingResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – user role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – user role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
bookingRouter.post(
  '/:bookingId/cancel',
  validateRequest(BookingIdParamSchema, APP_LABELS.PARAM),
  controller.cancelBooking
);

/**
 * @openapi
 * /api/v1/bookings/{serviceId}/checkAvailability:
 *   get:
 *     summary: Check service availability
 *     tags: [Bookings]
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
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         available:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – user role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
bookingRouter.get(
  '/:serviceId/checkAvailability',
  validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
  validateRequest(CheckAvailabilityQuerySchema, APP_LABELS.QUERY),
  controller.checkAvailability
);

bookingRouter.get(
  '/services/:serviceId/availability',
  validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
  validateRequest(GetMonthlyAvailabilitySchema, APP_LABELS.QUERY),
  controller.getMonthlyAvailability
)