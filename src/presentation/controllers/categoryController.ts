import container from "@/config/inversify/container";
import TYPES from "@/config/inversify/types";
import { CATEGORY_SUCCESS_MESSAGES } from "@/const/SuccessTypes.const";
import { CategoryMapper } from "@/dtos/mappers/categoryMapper.dto";
import { ICategoryService } from "@/services/interfaces/category.service.interface";
import HTTP_STATUS from "@/utils/httpStatusCodes";
import ResponseHandler from "@/utils/responseHandler";
import { errorStatusCodeMapper } from "@/utils/statusCodeMapper";
import { NextFunction, Request, Response } from "express";

const categoryService = container.get<ICategoryService>(TYPES.ICategoryService);

export const categoryController = {
    createCategory : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Create category request received');
            const input = req.validated?.body;
            const serviceData = CategoryMapper.toCreateCategoryRequestDTO(input)
            const response = await categoryService.createCategory(serviceData);
            if(!response.success){
                req.log.error('Create category request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!)
                );
            }
            req.log.info('Create category request successful');
            return ResponseHandler.success(
                res,
                CATEGORY_SUCCESS_MESSAGES.CATEGORY_CREATED,
                HTTP_STATUS.OK
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getCategories : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get categories request received');
            const input = req.validated?.query
            const serviceData = CategoryMapper.toGetCategoriesRequestDTO(input)
            const response = await categoryService.getCategories(serviceData);
            req.log.info('Get categories request successful');
            return ResponseHandler.success(
                res,
                CATEGORY_SUCCESS_MESSAGES.CATEGORIES_FETCHED,
                HTTP_STATUS.OK,
                response
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getCategory : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get category request received');
            const input = req.validated?.params
            const response = await categoryService.getCategory(input.id);
            if(!response.success){
                req.log.error('Get category request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage!,
                    errorStatusCodeMapper(response.errorMessage!)
                )
            }
            req.log.info('Get category request successful');
            return ResponseHandler.success(
                res,
                CATEGORY_SUCCESS_MESSAGES.CATEGORY_FETCHED,
                HTTP_STATUS.OK,
                response.data
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    updateCategory : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Update category request received');
            const input = req.validated?.body;
            const { categoryId } = req.validated?.params;
            const serviceData = CategoryMapper.toUpdateCategoryRequestDTO(categoryId, input);
            const response = await categoryService.updateCategory(serviceData);
            if(!response.success){
                req.log.error('Update category request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage!,
                    errorStatusCodeMapper(response.errorMessage!)
                )
            }
            req.log.info('Update category request successful');
            return ResponseHandler.success(
                res,
                CATEGORY_SUCCESS_MESSAGES.CATEGORY_UPDATED,
                HTTP_STATUS.OK
            );
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    deleteCategory : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Delete category request received');
            const { categoryId } = req.validated?.params;
            const response = await categoryService.deleteCategory(categoryId);
            if(!response.success){
                req.log.error('Delete category request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage!,
                    errorStatusCodeMapper(response.errorMessage!)
                );
            }
            req.log.info('Delete category request successful');
            return ResponseHandler.success(
                res,
                CATEGORY_SUCCESS_MESSAGES.CATEGORY_DELETED,
                HTTP_STATUS.OK
            );
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    }
}