import express from 'express';
import { authenticate, authorizeRole } from '../middlewares/jwt';
import { APP_LABELS } from '@/const/labels.const';
import { validateRequest } from '../middlewares/validateRequest';

export const categoryRouter = express.Router();

categoryRouter.use(authenticate);
categoryRouter.use(authorizeRole(APP_LABELS.ADMIN));

