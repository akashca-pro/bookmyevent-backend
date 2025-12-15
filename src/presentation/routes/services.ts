import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateServiceSchema, GetAvailableServicesQuerySchema, GetServicesQuerySchema, ServiceIdParamsSchema } from '@/validation/service.schema';
import { serviceController as controller } from '../controllers/serviceController';
import { APP_LABELS } from '@/const/labels.const';
import { authenticate, authorizeRole } from '../middlewares/jwt';

export const serviceRouter = express.Router();

serviceRouter.use(authenticate);

// get all available services within specific date range.
serviceRouter.get(
    '/available',
    validateRequest(GetAvailableServicesQuerySchema, APP_LABELS.QUERY),
    controller.getAvailableServices
)

serviceRouter.use(authorizeRole(APP_LABELS.ADMIN));

// create new service
serviceRouter.post(
    '/create',
    validateRequest(CreateServiceSchema),
    controller.createService
);

// update service
serviceRouter.patch(
    '/:serviceId/update',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.updateSerice
);

// archive service
serviceRouter.patch(
    '/:serviceId/archive',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.archiveService
);

// get specific service
serviceRouter.get(
    '/:serviceId',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.getService
);

// get all services
serviceRouter.get(
    '/',
    validateRequest(GetServicesQuerySchema, APP_LABELS.QUERY),
    controller.getServices
);

serviceRouter.get(
    '/:serviceId/bookings',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    validateRequest()
)