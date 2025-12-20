import express from 'express';
import { profileController as controller } from '../controllers/profileController';
import { authenticate } from '../middlewares/jwt';

export const profileRouter = express.Router();

profileRouter.use(authenticate);

/**
 * @openapi
 * /api/v1/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
profileRouter.get(
    '/',
    controller.profile
)