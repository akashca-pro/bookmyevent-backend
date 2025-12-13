import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateServiceSchema, GetAvailableServicesSchema, GetServicesSchema, ServiceIdParamsSchema } from '@/validation/service.schema';
import { serviceController as controller } from '../controllers/serviceController';
import { APP_LABELS } from '@/const/labels.const';

export const serviceRouter = express.Router();

serviceRouter.post(
    '/create',
    validateRequest(CreateServiceSchema),
    controller.createService
);

serviceRouter.patch(
    '/:serviceId/update',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.updateSerice
);

serviceRouter.patch(
    '/:serviceId/archive',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.archiveService
);

serviceRouter.get(
    '/:serviceId',
    validateRequest(ServiceIdParamsSchema, APP_LABELS.PARAM),
    controller.getService
);

serviceRouter.get(
    '/',
    validateRequest(GetServicesSchema, APP_LABELS.QUERY),
    controller.getServices
);

serviceRouter.get(
    '/available',
    validateRequest(GetAvailableServicesSchema, APP_LABELS.QUERY),
    controller.getAvailableServices
)

