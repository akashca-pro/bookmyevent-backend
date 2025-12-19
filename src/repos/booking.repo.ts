import { IBooking } from "@/db/interfaces/booking.interface";
import { BookingModel } from "@/db/models/booking.model";
import { IBookingRepo } from "./interfaces/booking.repo.interface";
import logger from "@/utils/pinoLogger";
import { BaseRepo } from "./base.repo";
import { ListOptions } from "@/dtos/Listoptions.dto";
import { IUser } from "@/db/interfaces/user.interface";
import { IService } from "@/db/interfaces/service.interface";
import { BOOKING_STATUS } from "@/const/bookingStatus.const";

export class BookingRepo extends BaseRepo<IBooking> implements IBookingRepo {
    constructor(){
        super(BookingModel)
    }

    async createBooking(
        data: Partial<IBooking>
    ): Promise<IBooking> {
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
    ): Promise<(IBooking & { serviceId : Partial<IService> })[]> {
        const startTime = Date.now();
        const operation = 'getBookingsByUser';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.find({ userId })
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort)
            .populate('serviceId', 'title description thumbnailUrl');
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result as (IBooking & { serviceId : IService })[];
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async updateStatus(
        id : string, 
        status : string
    ) : Promise<boolean> {
        const startTime = Date.now();
        const operation = 'updateStatus';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.updateOne(
                { _id: id, status: { $ne: status } },
                { $set: { status } }
            );
            logger.info(`[REPO] ${operation} successful`, { id, duration: Date.now() - startTime });
            return result.modifiedCount === 1;
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
    ): Promise<(IBooking & { userId : Partial<IUser> })[]> {
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

    async getMonthlyBookingMap(
        serviceId: string,
        month: number,
        year: number
    ): Promise<Record<string, boolean>> {
        const startTime = Date.now();
        const operation = 'getMonthlyBookingMap';

        try {
            logger.debug(`[REPO] Executing ${operation}`);

            const monthStart = new Date(year, month - 1, 1);
            const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

            const bookings = await this._model.find({
                serviceId,
                status: BOOKING_STATUS.CONFIRMED,
                startDate: { $lte: monthEnd },
                endDate: { $gte: monthStart }
            }).select('startDate endDate');

            const result: Record<string, boolean> = {};

            // initialize all days as false
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = new Date(year, month - 1, day).toISOString().split('T')[0];
                result[dateKey] = false;
            }

            // mark booked days
            for (const booking of bookings) {
                let current = new Date(
                    Math.max(booking.startDate.getTime(), monthStart.getTime())
                );

                const end = new Date(
                    Math.min(booking.endDate.getTime(), monthEnd.getTime())
                );

                while (current <= end) {
                    const key = current.toISOString().split('T')[0];
                    result[key] = true;
                    current.setDate(current.getDate() + 1);
                }
            }

            logger.info(`[REPO] ${operation} successful`, {
                days: Object.keys(result).length,
                duration: Date.now() - startTime
            });

            return result;
        } catch (error) {
                logger.error(`[REPO] ${operation} failed`, {
                error,
                duration: Date.now() - startTime
            });
            throw error;
        }
    }
}
