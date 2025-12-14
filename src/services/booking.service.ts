import { inject, injectable } from "inversify";
import { IBookingService } from "./interfaces/booking.service.interface";
import TYPES from "@/config/inversify/types";
import { IBookingRepo } from "@/repos/interfaces/booking.repo.interface";
import { CreateBookingRequestDTO } from "@/dtos/booking/createBooking.dto";
import logger from "@/utils/pinoLogger";
import { IServiceRepo } from "@/repos/interfaces/service.repo.interface";
import { ResponseDTO } from "@/dtos/Response.dto";
import { BOOKING_SERVICE_ERRORS, SERVICE_SERVICE_ERRORS } from "@/const/ErrorTypes.const";
import { BOOKING_STATUS } from "@/const/bookingStatus.const";
import { Types } from "mongoose";
import { IBooking } from "@/db/interfaces/booking.interface";
import { GetUserBookingRequestDTO } from "@/dtos/booking/getUserBookings.dto";
import { PaginationDTO } from "@/dtos/Pagination.dto";
import { GetServiceBookingsRequestDTO } from "@/dtos/booking/getServiceBookings.dto";
import { CancelBookingRequestDTO } from "@/dtos/booking/cancelBooking.dto";
import { ICacheProvider } from "@/providers/interfaces/cacheProvider.interface";
import { REDIS_KEY_PREFIX } from "@/config/redis/keyPrefix";
import { config } from "@/config";
import { CheckAvailabilityRequestDTO } from "@/dtos/booking/checkAvailability.dto";


@injectable()
export class BookingService implements IBookingService {

    #_bookingRepo : IBookingRepo;
    #_serviceRepo : IServiceRepo;
    #_cacheProvider : ICacheProvider;

    constructor(
        @inject(TYPES.IBookingRepo) bookingRepo : IBookingRepo,
        @inject(TYPES.IServiceRepo) serviceRepo : IServiceRepo,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider
    ){
        this.#_bookingRepo = bookingRepo;
        this.#_serviceRepo = serviceRepo;
        this.#_cacheProvider = cacheProvider;
    }

    async createBooking(
        req: CreateBookingRequestDTO
    ): Promise<ResponseDTO<null>> {
        const method = 'BookingService.createBooking'
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const { userId, serviceId, startDate, endDate} = req;
        const service = await this.#_serviceRepo.getServiceById(serviceId);
        if(!service){
            logger.error(`[BOOKING-SERVICE] ${method} service not found`);
            return {
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_NOT_FOUND,
                success : false
            }
        }
        if(startDate < service.availability.from || endDate > service.availability.to){
            logger.error(`[BOOKING-SERVICE] ${method} booking outside service availability`);
            return {
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_OUTSIDE_AVAILABILITY,
                success : false
            }
        }
        const conflictingBookings = await this.#_bookingRepo.getConflictingBookings(serviceId, startDate, endDate);
        if(conflictingBookings.length > 0){
            logger.error(`[BOOKING-SERVICE] ${method} conflicting bookings found`);
            return {
                data : null,
                errorMessage : BOOKING_SERVICE_ERRORS.BOOKING_ALREADY_EXISTS,
                success : false
            }
        }
        const diffDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalPrice = diffDays * service.pricePerDay;
        const booking = await this.#_bookingRepo.createBooking({
            userId : new Types.ObjectId(userId),
            serviceId : new Types.ObjectId(serviceId),
            startDate,
            endDate,
            totalPrice,
            status : BOOKING_STATUS.CONFIRMED
        })
        if(!booking){
            logger.error(`[BOOKING-SERVICE] ${method} booking creation failed`);
            return {
                data : null,
                errorMessage : BOOKING_SERVICE_ERRORS.BOOKING_FAILED,
                success : false
            }
        }
        logger.info(`[BOOKING-SERVICE] ${method} booking created`);
        return {
            data : null,
            success : true
        }
    }

    async getBookingById(
        id: string
    ): Promise<ResponseDTO<IBooking | null>> {
        const method = 'BookingService.getBookingById'
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const cacheKey = `${REDIS_KEY_PREFIX.BOOKING}${id}`;
        const cachedData = await this.#_cacheProvider.get(cacheKey) as IBooking;
        if(cachedData){
            logger.info(`[BOOKING-SERVICE] ${method} data fetched from cache`);
            return {
                data : cachedData,
                success : true
            }
        }
        const booking = await this.#_bookingRepo.getBookingById(id);
        if(!booking){
            logger.error(`[BOOKING-SERVICE] ${method} booking not found`);
            return {
                data : null,
                errorMessage : BOOKING_SERVICE_ERRORS.BOOKING_NOT_FOUND,
                success : false
            }
        }
        await this.#_cacheProvider.set(cacheKey, booking, config.BOOKING_CACHE_EXPIRY);
        logger.info(`[BOOKING-SERVICE] ${method} booking fetched`);
        return {
            data : booking,
            success : true
        }
    }

    async getUserBookings(
        req: GetUserBookingRequestDTO
    ): Promise<PaginationDTO<IBooking>> {
        const method = 'BookingService.getUserBookings'
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const { options, page, userId } = req;
        const skip = (page - 1) * options.limit;
        const [bookings, count] = await Promise.all([
            this.#_bookingRepo.getBookingsByUser(userId, { ...options, skip }),
            this.#_bookingRepo.countBookingsByUser(userId)
        ])
        logger.info(`[BOOKING-SERVICE] ${method} bookings fetched`);
        return {
            data : bookings,
            total : count,
            page,
            limit : options.limit
        }
    }

    async getServiceBookings(
        req: GetServiceBookingsRequestDTO
    ): Promise<PaginationDTO<IBooking>> {
        const method = 'BookingService.getServiceBookings';
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const { options, page, serviceId } = req;
        const skip = (page - 1) * options.limit;
        const [bookings, count] = await Promise.all([
            this.#_bookingRepo.getBookingsByService(serviceId, { ...options, skip }),
            this.#_bookingRepo.countBookingsByService(serviceId)
        ])
        logger.info(`[BOOKING-SERVICE] ${method} bookings fetched`);
        return {
            data : bookings,
            total : count,
            page,
            limit : options.limit
        }
    }

    async cancelBooking(
        req: CancelBookingRequestDTO
    ): Promise<ResponseDTO<null>> {
        const method = 'BookingService.cancelBooking'
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const { bookingId, userId } = req;
        const booking = await this.#_bookingRepo.getBookingById(bookingId);
        if(!booking){
            logger.error(`[BOOKING-SERVICE] ${method} booking not found`);
            return {
                data : null,
                errorMessage : BOOKING_SERVICE_ERRORS.BOOKING_NOT_FOUND,
                success : false
            }
        }
        if(booking.userId.toString() !== userId){
            logger.error(`[BOOKING-SERVICE] ${method} unauthorized access`);
            return {
                data : null,
                success : false,
                errorMessage : BOOKING_SERVICE_ERRORS.BOOKING_NOT_FOUND
            }
        }
        const cancelled = await this.#_bookingRepo.cancelBooking(bookingId);
        if(!cancelled){
            logger.error(`[BOOKING-SERVICE] ${method} booking cancellation failed`);
            return {
                data : null,
                success : false,
                errorMessage : BOOKING_SERVICE_ERRORS.BOOKING_FAILED
            }
        }
        logger.info(`[BOOKING-SERVICE] ${method} booking cancelled`);
        await this.#_cacheProvider.del(`${REDIS_KEY_PREFIX.BOOKING}${bookingId}`);
        return {
            data : null,
            success : true
        }
    }

    async checkAvailability(
        req : CheckAvailabilityRequestDTO
    ): Promise<ResponseDTO<null>> {
        const method = 'BookingService.checkAvailability'
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const { serviceId, startDate, endDate } = req;
        const service = await this.#_serviceRepo.getServiceById(serviceId);
        if(!service || service.isArchived){
            logger.error(`[BOOKING-SERVICE] ${method} service not found`);
            return {
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_NOT_FOUND,
                success : false
            }
        }
        if(startDate < service.availability.from || endDate > service.availability.to){
            logger.error(`[BOOKING-SERVICE] ${method} booking outside service availability`);
            return {
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_OUTSIDE_AVAILABILITY,
                success : false
            }
        }
        const conflictingBookings = await this.#_bookingRepo.getConflictingBookings(serviceId, startDate, endDate);
        if(conflictingBookings.length > 0){
            logger.error(`[BOOKING-SERVICE] ${method} conflicting bookings found`);
            return {
                data : null,
                errorMessage : BOOKING_SERVICE_ERRORS.BOOKING_ALREADY_EXISTS,
                success : false
            }
        }
        logger.info(`[BOOKING-SERVICE] ${method} booking available`);
        return {
            data : null,
            success : true
        }
    }
}