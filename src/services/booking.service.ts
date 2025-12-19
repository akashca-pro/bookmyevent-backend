import { inject, injectable } from "inversify";
import { IBookingService } from "./interfaces/booking.service.interface";
import TYPES from "@/config/inversify/types";
import { IBookingRepo } from "@/repos/interfaces/booking.repo.interface";
import { ReserveBookingRequestDTO, ReserveBookingResponseDTO } from "@/dtos/booking/reserveBooking.dto";
import logger from "@/utils/pinoLogger";
import { IServiceRepo } from "@/repos/interfaces/service.repo.interface";
import { ResponseDTO } from "@/dtos/Response.dto";
import { BOOKING_SERVICE_ERRORS, SERVICE_SERVICE_ERRORS } from "@/const/ErrorTypes.const";
import { BOOKING_STATUS } from "@/const/bookingStatus.const";
import { IBooking } from "@/db/interfaces/booking.interface";
import { GetUserBookingRequestDTO, GetUserBookingResponseDTO } from "@/dtos/booking/getUserBookings.dto";
import { PaginationDTO } from "@/dtos/Pagination.dto";
import { CancelBookingRequestDTO } from "@/dtos/booking/cancelBooking.dto";
import { ICacheProvider } from "@/providers/interfaces/cacheProvider.interface";
import { REDIS_KEY_PREFIX } from "@/config/redis/keyPrefix";
import { config } from "@/config";
import { CheckAvailabilityRequestDTO } from "@/dtos/booking/checkAvailability.dto";
import { BookingMapper } from "@/dtos/booking/BookingMapper.dto";
import { GetMonthlyAvailabilityDTO } from "@/dtos/booking/getMonthlyAvailability.dto";


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

    async reserveBooking(
        req: ReserveBookingRequestDTO
    ): Promise<ResponseDTO<ReserveBookingResponseDTO | null>> {
        const method = 'BookingService.reserveBooking'
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const { serviceId, startDate, endDate } = req;
        
        const resourceId = `${REDIS_KEY_PREFIX.BOOKING_LOCK}:${serviceId}:${startDate.toISOString()}`;
        const lockKey = `lock:${resourceId}`;
        
        const lockToken = await this.#_cacheProvider.acquireLock(resourceId, config.BOOKING_CACHE_EXPIRY);

        if (!lockToken) {
            logger.error(`[BOOKING-SERVICE] ${method} failed to acquire lock`);
            return { 
                data: null, 
                errorMessage: BOOKING_SERVICE_ERRORS.SLOT_ALREADY_BOOKED, 
                success: false 
            };
        }

        try {
            const service = await this.#_serviceRepo.getServiceById(serviceId.toString());
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
            const conflicting = await this.#_bookingRepo.getConflictingBookings(serviceId.toString(), startDate, endDate);
            const hasConflict = conflicting.some(b => b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.PENDING);
            
            if (hasConflict) {
                logger.error(`[BOOKING-SERVICE] ${method} booking already exists`);
                await this.#_cacheProvider.releaseLock(lockKey, lockToken);
                return { data: null, errorMessage: BOOKING_SERVICE_ERRORS.SLOT_ALREADY_BOOKED, success: false };
            }
            const diffDays = Math.ceil(
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const totalPrice = diffDays * service.pricePerDay;
            const booking = await this.#_bookingRepo.createBooking({
                ...req,
                totalPrice,
                status: BOOKING_STATUS.PENDING,
                lockKey,
                lockToken
            });
            const response = BookingMapper.toReserveBookingResponseDTO(booking);
            logger.info(`[BOOKING-SERVICE] ${method} booking reserved`);
            return { data: response, success: true };
        } catch (error) {
            logger.error(`[BOOKING-SERVICE] ${method} failed to reserve booking`);
            await this.#_cacheProvider.releaseLock(lockKey, lockToken);
            throw error;
        }
    }

    async confirmBooking(
        bookingId: string
    ): Promise<ResponseDTO<null>> {
        const method = 'BookingService.confirmBooking'
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const booking = await this.#_bookingRepo.getBookingById(bookingId);

        if (!booking || booking.status !== BOOKING_STATUS.PENDING) {
            logger.error(`[BOOKING-SERVICE] ${method} booking not found or already confirmed`);
            return { 
                data: null, 
                errorMessage: BOOKING_SERVICE_ERRORS.BOOKING_SESSION_EXPIRED, 
                success: false 
            };
        }

        await this.#_bookingRepo.updateStatus(bookingId, BOOKING_STATUS.CONFIRMED);
        logger.info(`[BOOKING-SERVICE] ${method} booking confirmed`);
        if (booking.lockKey && booking.lockToken) {
            await this.#_cacheProvider.releaseLock(booking.lockKey, booking.lockToken);
        }
        logger.info(`[BOOKING-SERVICE] ${method} lock released`);
        return { 
            data: null, 
            success: true 
        };
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
    ): Promise<PaginationDTO<GetUserBookingResponseDTO>> {
        const method = 'BookingService.getUserBookings'
        logger.info(`[BOOKING-SERVICE] ${method} started`);
        const { options, page, userId } = req;
        const skip = (page - 1) * options.limit;
        const [bookings, count] = await Promise.all([
            this.#_bookingRepo.getBookingsByUser(userId, { ...options, skip }),
            this.#_bookingRepo.countBookingsByUser(userId)
        ])
        const response = BookingMapper.toGetUserBookingResponseDTO(bookings);
        logger.info(`[BOOKING-SERVICE] ${method} bookings fetched`);
        return {
            data : response,
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

    async getMonthlyAvailability(
        req: GetMonthlyAvailabilityDTO
    ): Promise<ResponseDTO<Record<string, boolean> | null>> {

        const method = 'BookingService.getMonthlyAvailability';
        logger.info(`[BOOKING-SERVICE] ${method} started`);

        const { serviceId, month, year } = req;

        const service = await this.#_serviceRepo.getServiceById(serviceId);
        if (!service || service.isArchived) {
            return {
                data: null,
                success: false,
                errorMessage: SERVICE_SERVICE_ERRORS.SERVICE_NOT_FOUND
            };
        }

        const availabilityMap =
            await this.#_bookingRepo.getMonthlyBookingMap(serviceId, month, year);

        logger.info(`[BOOKING-SERVICE] ${method} completed`);

        return {
            data: availabilityMap,
            success: true
        };
    }

}