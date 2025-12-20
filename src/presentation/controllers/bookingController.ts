import container from "@/config/inversify/container";
import TYPES from "@/config/inversify/types";
import { BOOKING_SUCCESS_MESSAGES } from "@/const/SuccessTypes.const";
import { BookingMapper } from "@/dtos/mappers/BookingMapper.dto";
import { IBookingService } from "@/services/interfaces/booking.service.interface";
import HTTP_STATUS from "@/utils/httpStatusCodes";
import ResponseHandler from "@/utils/responseHandler";
import { errorStatusCodeMapper } from "@/utils/statusCodeMapper";
import { NextFunction, Request, Response } from "express";

const bookingService = container.get<IBookingService>(TYPES.IBookingService)

export const bookingController = {
    reserveBooking : async (req : Request, res : Response, next : NextFunction)=> {
        try {
            req.log.info('Reserve booking request received');
            const {serviceId} = req.validated?.params;
            const input = req.validated?.body;
            const bookingData = BookingMapper.toReserveBookingRequestDTO(input, req.userId!, serviceId!);
            const response = await bookingService.reserveBooking(bookingData);
            if(!response.success){
                req.log.error('Reserve booking request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!)
                );
            }
            req.log.info('Reserve booking request successful');
            return ResponseHandler.success(
                res,
                BOOKING_SUCCESS_MESSAGES.BOOKING_RESERVED,
                HTTP_STATUS.OK,
                response.data
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    confirmBooking : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Confirm booking request received');
            const { bookingId } = req.validated?.params;
            const response = await bookingService.confirmBooking(bookingId);
            if(!response.success){
                req.log.error('Confirm booking request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage!,
                    errorStatusCodeMapper(response.errorMessage!)
                );
            }
            req.log.info('Confirm booking request successful');
            return ResponseHandler.success(
                res,
                BOOKING_SUCCESS_MESSAGES.BOOKING_CONFIRMED,
                HTTP_STATUS.OK
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getBooking : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get booking request received');
            const { bookingId } = req.validated?.params;
            const response = await bookingService.getBookingById(bookingId);
            if(!response.success){
                req.log.error('Get booking request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!)
                );
            }
            req.log.info('Get booking request successful');
            return ResponseHandler.success(
                res,
                BOOKING_SUCCESS_MESSAGES.BOOKING_FETCHED,
                HTTP_STATUS.OK,
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getBookings : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get bookings request received');
            const input = req.validated?.query;
            const bookingData = BookingMapper.toGetUserBookingRequestDTO(input, req.userId!);
            const response = await bookingService.getUserBookings(bookingData);
            req.log.info('Get bookings request successful');
            return ResponseHandler.success(
                res,
                BOOKING_SUCCESS_MESSAGES.BOOKINGS_FETCHED,
                HTTP_STATUS.OK,
                response.data
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    cancelBooking : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Cancel booking request received');
            const input = req.validated?.params;
            const bookingData = BookingMapper.toCancelBookingRequestDTO(input, req.userId!);
            const response = await bookingService.cancelBooking(bookingData);
            if(!response.success){
                req.log.error('Cancel booking request failed');
                return ResponseHandler.error(
                    res, 
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!)
                )
            }
            req.log.info('Cancel booking request successful');  
            return ResponseHandler.success(
                res,
                BOOKING_SUCCESS_MESSAGES.BOOKING_CANCELLED,
                HTTP_STATUS.OK,
            );
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    checkAvailability : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Check availability request received');
            const input = req.validated?.query;
            const bookingData = BookingMapper.toCheckAvailabilityRequestDTO(input);
            const response = await bookingService.checkAvailability(bookingData);
            if(!response.success){
                req.log.error('Check availability request failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!)
                )
            }
            req.log.info('Check availability request successful');
            return ResponseHandler.success(
                res,
                BOOKING_SUCCESS_MESSAGES.AVAILABILITY_CHECKED,
                HTTP_STATUS.OK,
                response.data
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    },

    getMonthlyAvailability : async (req : Request, res : Response, next : NextFunction) => {
        try {
            req.log.info('Get monthly availability request received');
            const { serviceId } = req.validated?.params;
            const input = req.validated?.query;
            const bookingData = BookingMapper.toMonthlyAvailabilityRequestDTO(input, serviceId);
            const response = await bookingService.getMonthlyAvailability(bookingData);
            if(!response.success){
                req.log.error('Get monthly availability request failed');
                return ResponseHandler.error(
                    res, 
                    response.errorMessage,
                    errorStatusCodeMapper(response.errorMessage!)
                )
            }
            req.log.info('Get monthly availability request successful');
            return ResponseHandler.success(
                res,
                BOOKING_SUCCESS_MESSAGES.MONTHLY_AVAILABILITY_FETCHED,
                HTTP_STATUS.OK,
                response.data
            )
        } catch (error) {
            req.log.error(error);
            next(error);
        }
    }
}