import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authController as controller } from '../controllers/authController';
import { signupSchema } from '@/validation/auth.schema';

export const authRouter = express.Router();

authRouter.post(
    '/signup',
    validateRequest(signupSchema),
    controller.signup
)