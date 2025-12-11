import express from 'express';
import { profileController as controller } from '../controllers/profileController';
import { authenticate } from '../middlewares/jwt';

export const profileRouter = express.Router();

profileRouter.use(authenticate);

profileRouter.get(
    '/',
    controller.profile
)