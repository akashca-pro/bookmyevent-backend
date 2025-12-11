import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/pinoLogger';
import { CustomJwtPayload } from '@/types/jwt.type'
import ResponseHandler from '@/utils/responseHandler';
import HTTP_STATUS from '@/utils/httpStatusCodes';
import redis from '@/config/redis';
import { REDIS_KEY_PREFIX } from '@/config/redis/keyPrefix';
import { APP_LABELS } from '@/const/labels.const';
import { APP_ERRORS } from '@/const/ErrorTypes.const';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[APP_LABELS.ACCESS_TOKEN];

    if (!token) {
        return ResponseHandler.error(
            res,
            APP_ERRORS.TOKEN_NOT_FOUND,
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    try {
        const decoded = jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET) as CustomJwtPayload;

        if (!decoded || !decoded.userId || !decoded.email || !decoded.role) {
            return ResponseHandler.error(
                res,
                APP_ERRORS.INVALID_TOKEN_PAYLOAD,
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        if (req.path !== APP_LABELS.LOGOUT_PATH) {
            const blocked = await redis.get(`${REDIS_KEY_PREFIX.USER_BLOCKED}:${decoded.userId}`);
            if (blocked) {
                return ResponseHandler.error(
                    res,
                    APP_ERRORS.ACCOUNT_BLOCKED,
                    HTTP_STATUS.FORBIDDEN
                );
            }
        }

        req.userId = decoded.userId;
        req.name = decoded.name;
        req.email = decoded.email;
        req.role = decoded.role;

        next();
    } catch (error) {
        logger.error(APP_ERRORS.TOKEN_VERIFICATION_FAILED, error);
        return ResponseHandler.error(
            res,
            APP_ERRORS.INVALID_TOKEN_PAYLOAD,
            HTTP_STATUS.UNAUTHORIZED
        );
    }
};

export const authorizeRole = (acceptedRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.role) {
            return ResponseHandler.error(
                res,
                APP_ERRORS.INVALID_TOKEN_PAYLOAD,
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        if (req.role !== acceptedRole.toUpperCase()) {
            return ResponseHandler.error(
                res,
                APP_ERRORS.ENTRY_RESTRICTED,
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        next();
    };
};
