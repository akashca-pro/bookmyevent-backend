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

// create booking in specific service.
bookingRouter.post(
    '/:serviceId/create',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    validateRequest(CreateBookingSchema),
    controller.createBooking
);

// fetch specific booking details.
bookingRouter.get(
    '/:bookingId',
    validateRequest(BookingIdParamSchema, APP_LABELS.PARAM),
    controller.getBooking
);

// fetch all booking for specific user.
bookingRouter.get(
    '/',
    validateRequest(GetBookingsQuerySchema, APP_LABELS.QUERY),
    controller.getBookings
);

// cancel specific booking.
bookingRouter.post(
    '/:bookingId/cancel',
    validateRequest(BookingIdParamSchema, APP_LABELS.PARAM),
    controller.cancelBooking
)

// check availability for specific service within specific date range.
bookingRouter.get(
    '/:serviceId/checkAvailability',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    validateRequest(CheckAvailabilityQuerySchema, APP_LABELS.QUERY),
    controller.checkAvailability
)