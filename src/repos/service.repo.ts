import { IService } from "@/db/interfaces/service.interface";
import { BaseRepo } from "./base.repo";
import { IServiceRepo, ServiceFilter } from "./interfaces/service.repo.interface";
import { ServiceModel } from "@/db/models/service.model";
import logger from "@/utils/pinoLogger";
import { ListOptions } from "@/dtos/Listoptions.dto";


export class ServiceRepo extends BaseRepo<IService> implements IServiceRepo {
    constructor(){
        super(ServiceModel);
    }

    async createService(
        data: Partial<IService>
    ): Promise<IService | null> {
        const startTime = Date.now();
        const operation = 'createService';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.create(data);
            logger.info(`[REPO] ${operation} successful`, { id: result._id.toString(), duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getServiceByTitle(
        title : string
    ) : Promise<IService | null> {
        const startTime = Date.now();
        const operation = 'getServiceByTitle';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.findOne({ title });
            const found = !!result;
            logger.info(`[REPO] ${operation} successful`, { title, found, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, title, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getServiceById(
        id: string
    ): Promise<IService | null> {
        const startTime = Date.now();
        const operation = 'getServiceById';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.findById(id);
            const found = !!result;
            logger.info(`[REPO] ${operation} successful`, { id, found, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, id, duration: Date.now() - startTime });
            throw error;
        }
    }

    async updateService(
        id: string, 
        data: Partial<IService>
    ): Promise<boolean> {
        const startTime = Date.now();
        const operation = 'updateService';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.findByIdAndUpdate(id, data);
            const updated = !!result;
            logger.info(`[REPO] ${operation} successful`, { id, updated, duration: Date.now() - startTime });
            return updated;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async toggleArchiveStatus(
        id: string
    ): Promise<boolean> {
        const startTime = Date.now();
        const operation = 'toggleArchiveStatus';

        try {
            logger.debug(`[REPO] Executing ${operation}`, { id });
            const service = await this._model.findById(id).select('isArchived');
            if (!service) {
                logger.warn(`[REPO] ${operation} service not found`, { id });
                return false;
            }
            const nextIsArchived = !service.isArchived;
            const result = await this._model.updateOne(
                { _id: id },
                { $set: { isArchived: nextIsArchived } }
            );
            const updated = result.modifiedCount === 1;
            logger.info(`[REPO] ${operation} successful`, {
                id,
                previous: service.isArchived,
                current: nextIsArchived,
                updated,
                duration: Date.now() - startTime,
            });
            return updated;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                id,
                error,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async getServicesByAdmin(
        adminId: string, 
        options: ListOptions
    ): Promise<IService[]> {
        const startTime = Date.now();
        const operation = 'getServicesByAdmin';
        try {
            logger.debug(`[REPO] Executing ${operation}`);

            const result = await this._model
                .find({ adminId, isArchived: false })
                .skip(options.skip)
                .limit(options.limit)
                .sort(options.sort);

            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;

        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }


    async getServices(
        filter: ServiceFilter, 
        options: ListOptions
    ): Promise<IService[]> {
        const startTime = Date.now();
        const operation = 'getServices';

        try {
            logger.debug(`[REPO] Executing ${operation}`);

            const query: any = { isArchived: false };

            if (filter.category) query.category = filter.category;
            if (filter.city) query["location.city"] = filter.city;
            if (filter.adminId) query.adminId = filter.adminId;

            if (filter.minPrice != null || filter.maxPrice != null) {
                query.pricePerDay = {};
                if (filter.minPrice != null) query.pricePerDay.$gte = filter.minPrice;
                if (filter.maxPrice != null) query.pricePerDay.$lte = filter.maxPrice;
            }

            const result = await this._model
                .find(query)
                .skip(options.skip)
                .limit(options.limit)
                .sort(options.sort);

            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;

        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }


    async exists(
        id: string
    ): Promise<boolean> {
        const startTime = Date.now();
        const operation = 'exists';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.exists({ _id: id });
            const exists = !!result;
            logger.info(`[REPO] ${operation} successful`, { exists, id, duration: Date.now() - startTime });
            return exists;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getServicesByCategory(
        category: string, 
        options: ListOptions
    ): Promise<IService[]> {
        const startTime = Date.now();
        const operation = 'getServicesByCategory';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.find({ category }).skip(options.skip).limit(options.limit).sort(options.sort);
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getServicesByCity(
        city: string, 
        options: ListOptions
    ): Promise<IService[]> {
        const startTime = Date.now();
        const operation = 'getServicesByCity';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.find({ 'location.city' : city }).skip(options.skip).limit(options.limit).sort(options.sort);
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }   
    }

    async getAvailableServices(
        bookedServiceIds : string[],
        startDate: Date,
        endDate: Date,
        filter: ServiceFilter,
        options: ListOptions
    ): Promise<IService[]> {

        const startTime = Date.now();
        const operation = 'getAvailableServices';

        try {
            logger.debug(`[REPO] Executing ${operation}`);

            const query: any = {
                isArchived: false,
                _id: { $nin: bookedServiceIds },
                "availability.from": { $lte: endDate },
                "availability.to": { $gte: startDate }
            };

            if (filter.category) query.category = filter.category;
            if (filter.city) query["location.city"] = filter.city;
            if (filter.adminId) query.adminId = filter.adminId;

            if (filter.minPrice != null || filter.maxPrice != null) {
                query.pricePerDay = {};
                if (filter.minPrice != null) query.pricePerDay.$gte = filter.minPrice;
                if (filter.maxPrice != null) query.pricePerDay.$lte = filter.maxPrice;
            }

            const result = await this._model
                .find(query)
                .skip(options.skip)
                .limit(options.limit)
                .sort(options.sort);

            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;

        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async countServices(
        filter: ServiceFilter
    ): Promise<number> {
        const startTime = Date.now();
        const operation = 'countServices';
        try {
            logger.debug(`[REPO] Executing ${operation}`);

            const query: any = { isArchived: false };
            
            if (filter.category) query.category = filter.category;
            if (filter.city) query["location.city"] = filter.city;
            if (filter.adminId) query.adminId = filter.adminId;

            if (filter.minPrice != null || filter.maxPrice != null) {
                query.pricePerDay = {};
                if (filter.minPrice != null) query.pricePerDay.$gte = filter.minPrice;
                if (filter.maxPrice != null) query.pricePerDay.$lte = filter.maxPrice;
            }

            const result = await this._model.countDocuments(query);
            logger.info(`[REPO] ${operation} successful`, { count: result, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async countAvailableServices(
        bookedServiceIds : string[],
        startDate: Date,
        endDate: Date,
        filter: ServiceFilter
    ): Promise<number> {

        const startTime = Date.now();
        const operation = 'countAvailableServices';

        try {
            logger.debug(`[REPO] Executing ${operation}`);

            const query: any = {
                isArchived: false,
                _id: { $nin: bookedServiceIds },
                "availability.from": { $lte: endDate },
                "availability.to": { $gte: startDate }
            };

            if (filter.category) query.category = filter.category;
            if (filter.city) query["location.city"] = filter.city;
            if (filter.adminId) query.adminId = filter.adminId;

            if (filter.minPrice != null || filter.maxPrice != null) {
                query.pricePerDay = {};
                if (filter.minPrice != null) query.pricePerDay.$gte = filter.minPrice;
                if (filter.maxPrice != null) query.pricePerDay.$lte = filter.maxPrice;
            }

            const count = await this._model.countDocuments(query);

            logger.info(`[REPO] ${operation} successful`, { count, duration: Date.now() - startTime });
            return count;

        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }
}