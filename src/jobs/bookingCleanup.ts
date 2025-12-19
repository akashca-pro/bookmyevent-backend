import cron from 'node-cron';
import { BookingModel } from '@/db/models/booking.model';
import { BOOKING_STATUS } from '@/const/bookingStatus.const';
import RedisClient from '@/config/redis'; 
import logger from '@/utils/pinoLogger';
import container from '@/config/inversify/container';
import { ICacheProvider } from '@/providers/interfaces/cacheProvider.interface';
import TYPES from '@/config/inversify/types';

const cacheProvider = container.get<ICacheProvider>(TYPES.ICacheProvider)

const RELEASE_LUA_SCRIPT = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
    else
        return 0
    end
`;

export const setupBookingCleanupCron = () => {
    cron.schedule('* * * * *', async () => {
        const expiryThreshold = new Date(Date.now() - 5 * 60 * 1000); 

        try {
            const abandoned = await BookingModel.find({
                status: BOOKING_STATUS.PENDING,
                createdAt: { $lt: expiryThreshold }
            });

            for (const booking of abandoned) {
                // 1. Mark as Expired in DB
                booking.status = BOOKING_STATUS.EXPIRED;
                await booking.save();

                // 2. Safe Release in Redis
                if (booking.lockKey && booking.lockToken) {
                    await cacheProvider.releaseLock(booking.lockKey, booking.lockToken);
                }
                
                logger.info(`[CRON] Released abandoned booking: ${booking._id}`);
            }
        } catch (err) {
            logger.error('[CRON] Cleanup failed:', err);
        }
    });
};