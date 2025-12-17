import express from 'express';
import { authenticate, authorizeRole } from '../middlewares/jwt';
import { APP_LABELS } from '@/const/labels.const';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateCategorySchema, CategoryIdParamsSchema, UpdateCategorySchema } from '@/validation/category.schema';
import { categoryController as controller } from '../controllers/categoryController';
import { ListOptionsQuerySchema } from '@/validation/helpers.schema';

export const categoryRouter = express.Router();

categoryRouter.use(authenticate);
categoryRouter.use(authorizeRole(APP_LABELS.ADMIN));

categoryRouter.post(
    '/create',
    validateRequest(CreateCategorySchema),
    controller.createCategory
)

categoryRouter.get(
    '/',
    validateRequest(ListOptionsQuerySchema, APP_LABELS.QUERY),
    controller.getCategories
)

categoryRouter.get(
    '/:categoryId',
    validateRequest(CategoryIdParamsSchema, APP_LABELS.PARAM),
    controller.getCategory
)

categoryRouter.patch(
    '/:categoryId/update',
    validateRequest(CategoryIdParamsSchema, APP_LABELS.PARAM),
    validateRequest(UpdateCategorySchema),
    controller.updateCategory
)