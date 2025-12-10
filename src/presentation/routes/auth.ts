import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authController as controller } from '../controllers/authController';
import { LoginSchema, SignupSchema } from '@/validation/auth.schema';

export const authRouter = express.Router();

authRouter.post(
    '/signup',
    validateRequest(SignupSchema),
    controller.signup
)

authRouter.post(
    'user/login',
    validateRequest(LoginSchema),
    controller.userLogin
)

authRouter.post(
    'admin/login',
    validateRequest(LoginSchema),
    controller.adminLogin
)