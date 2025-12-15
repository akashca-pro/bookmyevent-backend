import { IBooking } from "@/db/interfaces/booking.interface";
import { BookingModel } from "@/db/models/booking.model";
import { IBookingRepo } from "./interfaces/booking.repo.interface";
import logger from "@/utils/pinoLogger";
import { BaseRepo } from "./base.repo";
import { ListOptions } from "@/dtos/Listoptions.dto";
import { IUser } from "@/db/interfaces/user.interface";

export class BookingRepo extends BaseRepo<IBooking> implements IBookingRepo {
    constructor(){
        super(BookingModel)
    }

    async createBooking(
        data: Partial<IBooking>
    ): Promise<IBooking | null> {
        const startTime = Date.now();
        const operation = 'createBooking';
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

    async getBookingById(
        id: string
    ): Promise<IBooking | null> {
        const startTime = Date.now();
        const operation = 'getBookingById';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.findById(id);
            const found = !!result;
            logger.info(`[REPO] ${operation} successful`, { id, found, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getBookingsByUser(
        userId: string, 
        options: ListOptions
    ): Promise<IBooking[]> {
        const startTime = Date.now();
        const operation = 'getBookingsByUser';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.find({ userId }).skip(options.skip).limit(options.limit).sort(options.sort);
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async countBookingsByUser(
        userId: string
    ): Promise<number> {
        const startTime = Date.now();
        const operation = 'countBookingsByUser';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.countDocuments({ userId });
            logger.info(`[REPO] ${operation} successful`, { count: result, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async countBookingsByService(
        serviceId: string
    ): Promise<number> {
        const startTime = Date.now();
        const operation = 'countBookingsByService';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.countDocuments({ serviceId });
            logger.info(`[REPO] ${operation} successful`, { result, duration: Date.now() - startTime});
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getBookingsByService(
        serviceId: string, 
        options: ListOptions
    ): Promise<(IBooking & { userId : IUser })[]> {
        const startTime = Date.now();
        const operation = 'getBookingsByService';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.find({ serviceId })
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort)
            .populate('userId', 'name email avatar');
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime});
            return result as (IBooking & { userId: IUser })[];
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getConflictingBookings(
        serviceId: string, 
        startDate: Date, 
        endDate: Date
    ): Promise<IBooking[]> {
        const startTime = Date.now();
        const operation = 'getConflictingBookings';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.find(
                {
                    serviceId,
                    status: "CONFIRMED",
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate }
                }
            );
            logger.info(`[REPO] ${operation} successful`, { conflicts: result.length, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getBookedServiceIdsInRange(
        startDate: Date, 
        endDate: Date
    ): Promise<string[]> {
        const startTime = Date.now();
        const operation = 'getBookedServiceIdsInRange';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.distinct("serviceId", {
                status: "CONFIRMED",
                $or: [
                    {
                        startDate: { $lte: endDate },
                        endDate: { $gte: startDate }
                    }
                ]
            });
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async cancelBooking(
        id: string
    ): Promise<boolean> {
        const startTime = Date.now();
        const operation = 'cancelBooking';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.findByIdAndUpdate(id, { status: "CANCELLED" });
            const found = !!result;
            logger.info(`[REPO] ${operation} successful`, { found, duration: Date.now() - startTime });
            return found;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

}
