import container from "@/config/inversify/container";
import TYPES from "@/config/inversify/types";
import { SERVICE_SUCCESS_MESSAGES } from "@/const/SuccessTypes.const";
import { ServiceMapper } from "@/dtos/mappers/ServiceMapper.dto";
import { IServiceService } from "@/services/interfaces/service.service.interface";
import { uploadServiceImageBuffer } from "@/utils/cloudinary/uploadImageToCloudinary";
import HTTP_STATUS from "@/utils/httpStatusCodes";
import ResponseHandler from "@/utils/responseHandler";
import { errorStatusCodeMapper } from "@/utils/statusCodeMapper";
import { NextFunction, Request, Response } from "express";

const serviceService = container.get<IServiceService>(TYPES.IServiceService)

export const serviceController = {
    createService : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Create service request received');
            const input = req.validated?.body;
            const serviceData = ServiceMapper.toCreateServiceRequestDTO(req.userId!, input);
            const response = await serviceService.createService(serviceData);
            if(!response.success){
                return ResponseHandler.error(
                    res,
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!),
                )
            }
            req.log.info('Create service request successfull');
            return ResponseHandler.success(
                res,
                SERVICE_SUCCESS_MESSAGES.SERVICE_CREATED,
                HTTP_STATUS.OK,
                response.data
            )
        } catch (error) {
            next(error);
        }
    },

    updateSerice : async(req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Update service request received');
            const input = req.validated?.body;
            const { serviceId } = req.validated?.params;
            const thumbnailFile = req.file;
            let thumbnail = null;
            if(thumbnailFile){
                req.log.info(`${serviceId} Uploading thumbnail to cloudinary`);
                const random = Math.random().toString(36).slice(2, 8);
                const galleryKey = `gallery_${Date.now()}_${random}` as const;
                const result = await uploadServiceImageBuffer(
                    thumbnailFile.buffer, 
                    serviceId, 
                    galleryKey
                );
                thumbnail = result.public_id;
                req.log.info(`${serviceId} Thumbnail uploaded to cloudinary`);
            }
            const serviceData = ServiceMapper.toUpdateServiceRequestDTO(serviceId, input, thumbnail);
            const response = await serviceService.updateService(serviceData);
            if(!response.success){
                req.log.error({ error : response.errorMessage },'Update service request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!),
                )
            }
            req.log.info('Update service request successfull');
            return ResponseHandler.success(
                res,
                SERVICE_SUCCESS_MESSAGES.SERVICE_UPDATED,
                HTTP_STATUS.OK
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getService : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get service request received');
            const { serviceId } = req.validated?.params;
            const response = await serviceService.getService(serviceId);
            if(!response.success){
                req.log.error({ error : response.errorMessage },'Get service request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!),
                )
            }
            req.log.info('Get service request successfull');
            return ResponseHandler.success(
                res,
                SERVICE_SUCCESS_MESSAGES.SERVICE_FETCHED,
                HTTP_STATUS.OK,
                response.data
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getServices : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get services request received');
            const input = req.validated?.query;
            const serviceData = ServiceMapper.toGetServicesRequestDTO(input);
            const response = await serviceService.getServices(serviceData);
            req.log.info('Get services request successfull');
            return ResponseHandler.success(
                res,
                SERVICE_SUCCESS_MESSAGES.SERVICES_FETCHED,
                HTTP_STATUS.OK,
                response
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getAvailableServices : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get available services request received');
            const input = req.validated?.query;
            const serviceData = ServiceMapper.toGetAvailableServicesRequestDTO(input);
            const response = await serviceService.getAvailableServices(serviceData);
            req.log.info('Get available services request successfull');
            return ResponseHandler.success(
                res,
                SERVICE_SUCCESS_MESSAGES.SERVICES_FETCHED,
                HTTP_STATUS.OK,
                response
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getBookingsByService : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get bookings by service request received');
            const input = req.validated?.query;
            const { serviceId } = req.validated?.params;
            const bookingData = ServiceMapper.toGetBookingsByServiceRequestDTO(input, serviceId);
            const response = await serviceService.getBookingsByService(bookingData);
            req.log.info('Get bookings by service request successfull');
            return ResponseHandler.success(
                res,
                SERVICE_SUCCESS_MESSAGES.BOOKINGS_BY_SERVICE_FETCHED,
                HTTP_STATUS.OK,
                response
            );
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    }
}