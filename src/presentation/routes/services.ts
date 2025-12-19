import express from 'express';
import { validateFile, validateRequest } from '../middlewares/validateRequest';
import {
  CreateServiceSchema,
  GetAvailableServicesQuerySchema,
  GetBookingsByServicesQuerySchema,
  GetServicesQuerySchema,
  ServiceIdParamsSchema,
  UpdateServiceSchema,
} from '@/validation/service.schema';
import { serviceController as controller } from '../controllers/serviceController';
import { APP_LABELS } from '@/const/labels.const';
import { authenticate, authorizeRole } from '../middlewares/jwt';
import { upload } from '@/utils/multer';

export const serviceRouter = express.Router();

/**
 * @openapi
 * /api/v1/services/available:
 *   get:
 *     summary: Get available services within date range
 *     tags: [Services]
 *     security: []
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
 *               $ref: '#/components/schemas/PaginatedServiceResponse'
 */
serviceRouter.get(
  '/available',
  validateRequest(GetAvailableServicesQuerySchema, APP_LABELS.QUERY),
  controller.getAvailableServices
);

/**
 * @openapi
 * /api/v1/services/{serviceId}:
 *   get:
 *     summary: Get service details
 *     tags: [Services]
 *     security: []
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
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
serviceRouter.get(
  '/:serviceId',
  validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
  controller.getService
);

// ───────────────────────── ADMIN PROTECTED ─────────────────────────

serviceRouter.use(authenticate);
serviceRouter.use(authorizeRole(APP_LABELS.ADMIN));

/**
 * @openapi
 * /api/v1/services/create:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       200:
 *         description: Service created
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
 *         description: Forbidden – admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     tags: [Services]
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
 *             $ref: '#/components/schemas/UpdateServiceRequest'
 *     responses:
 *       200:
 *         description: Service updated
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
 *         description: Forbidden – admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
serviceRouter.patch(
  '/:serviceId/update',
  upload.single("thumbnail"),
  validateFile({ fieldName : 'thumbnail' }),
  validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
  validateRequest(UpdateServiceSchema),
  controller.updateSerice
);

/**
 * @openapi
 * /api/v1/services/{serviceId}/archive:
 *   patch:
 *     summary: Archive service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service archived
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
 *         description: Forbidden – admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     tags: [Services]
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
 *         name: municipality
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Services list fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedServiceResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Forbidden – admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
serviceRouter.get(
  '/:serviceId/bookings',
  validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
  validateRequest(GetBookingsByServicesQuerySchema, APP_LABELS.QUERY),
  controller.getBookingsByService
);
