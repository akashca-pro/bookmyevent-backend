import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateServiceSchema, GetAvailableServicesQuerySchema, GetBookingsByServicesQuerySchema, GetServicesQuerySchema, ServiceIdParamsSchema } from '@/validation/service.schema';
import { serviceController as controller } from '../controllers/serviceController';
import { APP_LABELS } from '@/const/labels.const';
import { authenticate, authorizeRole } from '../middlewares/jwt';

export const serviceRouter = express.Router();

serviceRouter.use(authenticate);

/**
 * @openapi
 * /api/v1/services/available:
 *   get:
 *     summary: Get available services within date range
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Available services fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceResponse'
 */
serviceRouter.get(
    '/available',
    validateRequest(GetAvailableServicesQuerySchema, APP_LABELS.QUERY),
    controller.getAvailableServices
)

/**
 * @openapi
 * /api/v1/services/{serviceId}:
 *   get:
 *     summary: Get service details
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 */
serviceRouter.get(
    '/:serviceId',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.getService
);

serviceRouter.use(authorizeRole(APP_LABELS.ADMIN));

/**
 * @openapi
 * /api/v1/services/create:
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       200:
 *         description: Service created successfully
 *       400:
 *         description: Validation or business error
 */
serviceRouter.post(
    '/create',
    validateRequest(CreateServiceSchema),
    controller.createService
);

/**
 * @openapi
 * /api/v1/services/{serviceId}/update:
 *   patch:
 *     summary: Update service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
serviceRouter.patch(
    '/:serviceId/update',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.updateSerice
);

/**
 * @openapi
 * /api/v1/services/{serviceId}/archive:
 *   patch:
 *     summary: Archive service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service archived successfully
 */
serviceRouter.patch(
    '/:serviceId/archive',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.archiveService
);

/**
 * @openapi
 * /api/v1/services:
 *   get:
 *     summary: Get all services
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Services list fetched
 */
serviceRouter.get(
    '/',
    validateRequest(GetServicesQuerySchema, APP_LABELS.QUERY),
    controller.getServices
);

/**
 * @openapi
 * /api/v1/services/{serviceId}/bookings:
 *   get:
 *     summary: Get bookings for a service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bookings fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingByServiceResponse'
 */
serviceRouter.get(
    '/:serviceId/bookings',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    validateRequest(GetBookingsByServicesQuerySchema, APP_LABELS.QUERY),
    controller.getBookingsByService
)