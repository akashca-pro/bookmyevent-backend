import { config } from "@/config";
import container from "@/config/inversify/container";
import TYPES from "@/config/inversify/types";
import { APP_LABELS } from "@/const/labels.const";
import { AUTH_SUCCESS_MESSAGES } from "@/const/SuccessTypes.const";
import { IAuthService } from "@/services/interfaces/auth.service.interface";
import HTTP_STATUS from "@/utils/httpStatusCodes";
import ResponseHandler from "@/utils/responseHandler";
import { setCookie } from "@/utils/set-cookie";
import ms from "ms";
import { NextFunction, Request, Response } from "express";
import { AuthMapper } from "@/dtos/auth/AuthMapper.dto";

const authService = container.get<IAuthService>(TYPES.IAuthService);

export const authController = {
    
    signup : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Signup request received');
            const input = req.validated?.body;
            const serviceData = AuthMapper.toSignupService(input);
            const response = await authService.signup(serviceData);
            if(!response.success){
                req.log.info({ error : response.errorMessage },'Signup failed')
                return ResponseHandler.error(res, response.errorMessage, HTTP_STATUS.BAD_REQUEST);
            }
            req.log.info({ email: req.validated?.body.email },'Signup successfull');
            setCookie(res, APP_LABELS.ACCESS_TOKEN, response.data?.accessToken!, config.JWT_ACCESS_TOKEN_EXPIRY as ms.StringValue);
            return ResponseHandler.success(res, AUTH_SUCCESS_MESSAGES.USER_CREATED, HTTP_STATUS.OK, response.data?.user);
        } catch (error) {
            req.log.error(error);
            next(error)
        }
    },

    login : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Login request received');
            const input =  req.validated?.body;
            const serviceData = AuthMapper.toLoginService(input);
            const response = await authService.login(serviceData);
            if(!response.success){
                req.log.info({ error : response.errorMessage },'Login failed')
                return ResponseHandler.error(res, response.errorMessage, HTTP_STATUS.BAD_REQUEST);
            }
            req.log.info({ email: req.validated?.body.email },'Login successfull');
            setCookie(res, APP_LABELS.ACCESS_TOKEN, response.data?.accessToken!, config.JWT_ACCESS_TOKEN_EXPIRY as ms.StringValue);
            return ResponseHandler.success(res, AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESSFUL, HTTP_STATUS.OK, response.data?.user);
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    }
}