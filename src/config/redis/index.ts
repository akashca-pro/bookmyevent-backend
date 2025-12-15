import Redis from 'ioredis';
import { config } from '@/config';
import logger from '@/utils/pinoLogger';

class RedisClient {
    private static instance : Redis
    private static isConnected = false;

    private constructor() {}

    public static getInstance() : Redis {
        if(!RedisClient.instance){
            RedisClient.instance = new Redis(config.REDIS_URL as string, {
                retryStrategy : (times : number) => {
                    const delay = Math.min(times * 50,2000);
                    return delay
                },
                maxRetriesPerRequest : 10,
            });
            RedisClient.setupEventListeners();
        }
        return RedisClient.instance
    }

    public static setupEventListeners() : void {
        RedisClient.instance.on('ready',()=>{
            RedisClient.isConnected = true;
            logger.info('Redis is ready');
        })

    RedisClient.instance.on('error', (error) => {
      RedisClient.isConnected = false;
      logger.error('Redis connection error:', error);
    });

    RedisClient.instance.on('close', () => {
      RedisClient.isConnected = false;
      logger.warn('Redis connection closed');
    });

    RedisClient.instance.on('reconnecting', () => {
      logger.info('Reconnecting to Redis...');
    });
    }

    public static isReady() : boolean {
        return RedisClient.isConnected
    }
}

export default RedisClient.getInstance();