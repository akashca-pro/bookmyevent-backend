import { inject, injectable } from "inversify";
import { IServiceService } from "./interfaces/service.service.interface";
import { IServiceRepo } from "@/repos/interfaces/service.repo.interface";
import TYPES from "@/config/inversify/types";
import { IBookingRepo } from "@/repos/interfaces/booking.repo.interface";
import { ResponseDTO } from "@/dtos/Response.dto";
import { CreateServiceRequestDTO } from "@/dtos/service/createService.dto";
import logger from "@/utils/pinoLogger";
import { Types } from "mongoose";
import { SERVICE_SERVICE_ERRORS } from "@/const/ErrorTypes.const";
import { UpdateServiceRequestDTO } from "@/dtos/service/updateService.dto";
import { ArchiveServiceRequestDTO } from "@/dtos/service/archiveService.dto";
import { IService } from "@/db/interfaces/service.interface";
import { PaginationDTO } from "@/dtos/Pagination.dto";
import { GetServicesRequestDTO } from "@/dtos/service/getServices.dto";
import { GetAvailableServicesRequestDTO, GetAvailableServicesResponseDTO } from "@/dtos/service/getAvailableServices.dto";
import { REDIS_KEY_PREFIX } from "@/config/redis/keyPrefix";
import { ICacheProvider } from "@/providers/interfaces/cacheProvider.interface";
import { config } from "@/config";
import { GetBookingByServiceRequestDTO, GetBookingsByServiceResponseDTO } from "@/dtos/service/getBookingsByServices.dto";
import { ServiceMapper } from "@/dtos/service/ServiceMapper.dto";

@injectable()
export class ServiceService implements IServiceService {

    #_serviceRepo : IServiceRepo;
    #_bookingRepo : IBookingRepo;
    #_cacheProvider : ICacheProvider;


    constructor(
        @inject(TYPES.IServiceRepo) serviceRepo : IServiceRepo,
        @inject(TYPES.IBookingRepo) bookingRepo : IBookingRepo,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider
    ){
        this.#_serviceRepo = serviceRepo;
        this.#_bookingRepo = bookingRepo;
        this.#_cacheProvider = cacheProvider;
    }

    async createService(
        req: CreateServiceRequestDTO
    ): Promise<ResponseDTO<null>> {
        const method = 'ServiceService.createService'
        logger.info(`[SERVICE-SERVICE] ${method} started`);
        const titleExists = await this.#_serviceRepo.getServiceByTitle(req.data.title);
        if(titleExists){
            logger.error(`[SERVICE-SERVICE] ${method} title already exists`);
            return {
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_TITLE_ALREADY_EXISTS,
                success : false
            }
        }
        const service = await this.#_serviceRepo.createService({...req, adminId : new Types.ObjectId(req.adminId) });
        if(!service){
            logger.error(`[SERVICE-SERVICE] ${method} service creation failed`);
            return {
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_CREATION_FAILED,
                success : false
            }
        }
        return {
            data : null,
            success : true
        }
    }

    async updateService(
        req: UpdateServiceRequestDTO
    ): Promise<ResponseDTO<null>> {
        const method = 'ServiceService.updateService'
        logger.info(`[SERVICE-SERVICE] ${method} started`);
        const serviceExist = await this.#_serviceRepo.exists(req.id);
        if(!serviceExist){
            logger.error(`[SERVICE-SERVICE] ${method} service not found`);
            return {
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_NOT_FOUND,
                success : false
            }
        }
        const updated = await this.#_serviceRepo.updateService(req.id, req.data);
        if(!updated){
            return{
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_UPDATION_FAILED,
                success : false
            }
        }
        logger.info(`[SERVICE-SERVICE] ${method} service updated`);
        return {
            data : null,
            success : true
        }
    }

    async archiveService(
        req: ArchiveServiceRequestDTO
    ): Promise<ResponseDTO<null>> {
        const method = 'ServiceService.archiveService';
        logger.info(`[SERVICE-SERVICE] ${method} started`, { serviceId: req.id });

        const service = await this.#_serviceRepo.getServiceById(req.id);
        if (!service) {
            logger.error(`[SERVICE-SERVICE] ${method} service not found`);
            return {
                data: null,
                errorMessage: SERVICE_SERVICE_ERRORS.SERVICE_NOT_FOUND,
                success: false,
            };
        }

        // If trying to archive AND bookings exist → block
        if (!service.isArchived) {
            const bookings = await this.#_bookingRepo.getBookingsByService(req.id);
            if (bookings.length > 0) {
                logger.error(
                    `[SERVICE-SERVICE] ${method} cannot archive, bookings exist`,
                    { serviceId: req.id, bookingsCount: bookings.length }
                );
                return {
                    data: null,
                    errorMessage: SERVICE_SERVICE_ERRORS.SERVICE_HAS_BOOKINGS,
                    success: false,
                };
            }
        }

        const updated = await this.#_serviceRepo.toggleArchiveStatus(req.id);
        if (!updated) {
            logger.error(`[SERVICE-SERVICE] ${method} archive toggle failed`);
            return {
                data: null,
                errorMessage: SERVICE_SERVICE_ERRORS.SERVICE_ARCHIVING_FAILED,
                success: false,
            };
        }

        await this.#_cacheProvider.del(`${REDIS_KEY_PREFIX.SERVICE}${req.id}`);

        logger.info(
            `[SERVICE-SERVICE] ${method} success`,
            {
                serviceId: req.id,
                from: service.isArchived,
                to: !service.isArchived,
            }
        );

        return {
            data: null,
            success: true,
        };
    }


    async getService(
        id: string
    ): Promise<ResponseDTO<IService | null>> {
        const method = 'ServiceService.getService'
        logger.info(`[SERVICE-SERVICE] ${method} started`);
        const cacheKey = `${REDIS_KEY_PREFIX.SERVICE}${id}`;
        const cachedData = await this.#_cacheProvider.get(cacheKey) as IService;
        if(cachedData){
            logger.info(`[SERVICE-SERVICE] ${method} data fetched from cache`);
            return {
                data : cachedData,
                success : true
            }
        }
        const service = await this.#_serviceRepo.getServiceById(id);
        if(!service){
            logger.error(`[SERVICE-SERVICE] ${method} service not found`);
            return {
                data : null,
                errorMessage : SERVICE_SERVICE_ERRORS.SERVICE_NOT_FOUND,
                success : false
            }
        }
        await this.#_cacheProvider.set(cacheKey, service, config.SERVICE_CACHE_EXPIRY);
        logger.info(`[SERVICE-SERVICE] ${method} service fetched`);
        return {
            data : service,
            success : true
        }
    }

    async getServices(
        req: GetServicesRequestDTO
    ): Promise<PaginationDTO<IService>> {
        const method = 'ServiceService.getServices';
        logger.info(`[SERVICE-SERVICE] ${method} started`);
        const skip = (req.page - 1) * req.options.limit;
        const [services, count] = await Promise.all([
            this.#_serviceRepo.getServices(req.filter, { ...req.options, skip }),
            this.#_serviceRepo.countServices(req.filter)
        ])
        logger.info(`[SERVICE-SERVICE] ${method} services fetched`);
        return {
            data : services,
            total : count,
            page : req.page,
            limit : req.options.limit
        }
    }

    async getAvailableServices(
        req: GetAvailableServicesRequestDTO
    ): Promise<PaginationDTO<GetAvailableServicesResponseDTO>> {
        const method = 'ServiceService.getAvailableServices';
        logger.info(`[SERVICE-SERVICE] ${method} started`);
        const bookedServiceIds = await this.#_bookingRepo.getBookedServiceIdsInRange(req.startDate, req.endDate);
        const skip = (req.page - 1) * req.options.limit;
        const [data, count] = await Promise.all([
            this.#_serviceRepo.getAvailableServices(bookedServiceIds, req.startDate, req.endDate, req.filter, { ...req.options, skip }),
            this.#_serviceRepo.countAvailableServices(bookedServiceIds, req.startDate, req.endDate, req.filter)
        ]);
        logger.info(`[SERVICE-SERVICE] ${method} services fetched`);
        return {
            data,
            total : count,
            page : req.page,
            limit : req.options.limit
        }
    }

    async getBookingsByService(
        req : GetBookingByServiceRequestDTO
    ): Promise<PaginationDTO<GetBookingsByServiceResponseDTO>> {
        const method = 'ServiceService.getBookingsByService';
        logger.info(`[SERVICE-SERVICE] ${method} started`);
        const { serviceId, page, options} = req;
        const serviceExists = await this.#_serviceRepo.exists(serviceId);
        if (!serviceExists) {
            logger.error(`[SERVICE-SERVICE] ${method} service not found`);
            return {
                data: [],
                total: 0,
                page,
                limit : options.limit
            };
        }
        const [bookings, total] = await Promise.all([
            this.#_bookingRepo.getBookingsByService(serviceId, { ...options, skip: (page - 1) * options.limit }),
            this.#_bookingRepo.countBookingsByService(serviceId)
        ]);
        const response = ServiceMapper.toGetBookingsByServiceResponseDTO(bookings);
        logger.info(`[SERVICE-SERVICE] ${method} bookings fetched`);
        return {
            data : response,
            total,
            page,
            limit : options.limit
        }
    }
}