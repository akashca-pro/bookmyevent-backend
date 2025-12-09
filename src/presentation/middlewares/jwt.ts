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

const verifyJwt = (token : string,secret : string) : CustomJwtPayload => {
    return jwt.verify(token,secret) as CustomJwtPayload
}

export const verifyAccessToken = (acceptedRole : string) => async (
    req : Request,
    res : Response, 
    next : NextFunction) =>{

    const token = req.cookies[APP_LABELS.ACCESS_TOKEN]

    if(!token)
        return ResponseHandler.error(
            res,
            APP_ERRORS.TOKEN_NOT_FOUND,
            HTTP_STATUS.UNAUTHORIZED
        );

    try {
        const decoded = verifyJwt(
            token, 
            config.JWT_ACCESS_TOKEN_SECRET as string
        );

        if (!decoded || !decoded.userId || !decoded.email || !decoded.role || !decoded.tokenId) {
            return ResponseHandler.error(
                res, 
                APP_ERRORS.INVALID_TOKEN_PAYLOAD, 
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        if(decoded.role !== acceptedRole.toUpperCase())
            return ResponseHandler.error(
                res,
                APP_ERRORS.ENTRY_RESTRICTED,
                HTTP_STATUS.UNAUTHORIZED
        );

        // Check blacklist
        const blacklisted = await redis.get(`${REDIS_KEY_PREFIX.BLACKLIST_ACCESS_TOKEN}${decoded.tokenId}`);
        if (blacklisted) {
            return ResponseHandler.error(
                res, 
                APP_ERRORS.TOKEN_BLACKLISTED, 
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Check blocked user
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
        req.email = decoded.email;
        req.username = decoded.username;
        req.role = decoded.role;
        req.accessTokenId = decoded.tokenId;
        req.accessTokenExp = decoded.exp;

        next();
        
    } catch (error) {
        logger.error(APP_ERRORS.TOKEN_VERIFICATION_FAILED,error);
        return ResponseHandler.error(
            res,
            APP_ERRORS.INVALID_TOKEN_PAYLOAD,
            HTTP_STATUS.UNAUTHORIZED
        );
    }
};

export const verifyRefreshToken = (acceptedRole : string) => async (
    req : Request,
    res : Response,
    next : NextFunction) => {

    const token = req.cookies[APP_LABELS.REFRESH_TOKEN];

    if(!token)
        return ResponseHandler.error(
            res,
            APP_ERRORS.TOKEN_NOT_FOUND,
            HTTP_STATUS.UNAUTHORIZED
    );

    try {
        const decoded = verifyJwt(token, config.JWT_REFRESH_TOKEN_SECRET as string);

        if (!decoded || !decoded.userId || !decoded.email || !decoded.role || !decoded.tokenId) {
            return ResponseHandler.error(
                res, 
                APP_ERRORS.INVALID_TOKEN_PAYLOAD, 
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        if(decoded.role !== acceptedRole.toUpperCase())
            return ResponseHandler.error(
                res,
                APP_ERRORS.ENTRY_RESTRICTED,
                HTTP_STATUS.UNAUTHORIZED
        );

        // Check blacklist
        const blacklisted = await redis.get(`${REDIS_KEY_PREFIX.BLACKLIST_ACCESS_TOKEN}${decoded.tokenId}`);
        if (blacklisted) {
            return ResponseHandler.error(
                res, 
                APP_ERRORS.TOKEN_BLACKLISTED, 
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        req.userId = decoded.userId;
        req.email = decoded.email;
        req.username = decoded.username;
        req.role = decoded.role;
        req.refreshTokenId = decoded.tokenId;
        req.refreshTokenExp = decoded.exp;
        next();

    } catch (error) {
        logger.error(APP_ERRORS.TOKEN_VERIFICATION_FAILED,error);
        return ResponseHandler.error(
            res,
            APP_ERRORS.INVALID_TOKEN_PAYLOAD,
            HTTP_STATUS.UNAUTHORIZED
        );
    }
}

