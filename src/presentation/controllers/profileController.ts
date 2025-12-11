import container from "@/config/inversify/container";
import TYPES from "@/config/inversify/types";
import { PROFILE_SUCCESS_MESSAGES } from "@/const/SuccessTypes.const";
import { IProfileService } from "@/services/interfaces/profile.service.interface";
import HTTP_STATUS from "@/utils/httpStatusCodes";
import ResponseHandler from "@/utils/responseHandler";
import { NextFunction, Request, Response } from "express";

const profileService = container.get<IProfileService>(TYPES.IProfileService);

export const profileController = {
    profile : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Profile request received');
            const response = await profileService.profile(req.userId!);
            if(!response.success){
                req.log.info({ error : response.errorMessage },'Profile request failed')
                return ResponseHandler.error(res, response.errorMessage, HTTP_STATUS.BAD_REQUEST);
            }
            req.log.info('Profile request successfull');
            return ResponseHandler.success(res, PROFILE_SUCCESS_MESSAGES.PROFILE_FETCHED, HTTP_STATUS.OK, response.data)
        } catch (error) {
            next(error);
        }
    }
}