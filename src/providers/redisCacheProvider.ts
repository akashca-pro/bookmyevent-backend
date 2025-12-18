import { ICacheProvider } from "@/providers/interfaces/cacheProvider.interface";
import redis from "@/config/redis";
import { injectable } from "inversify";


/**
 * Redis cache provider.
 * 
 * @class
 * @implements {ICacheProvider}
 */
@injectable()
export class RedisCacheProvider implements ICacheProvider {

    readonly #_redis = redis

    async get<T>(key: string): Promise<T | null> {
        const data = await this.#_redis.get(key);
        return data ? JSON.parse(data) as T : null;
    }

    async set<T>(key: string, value: T, ttl: number): Promise<void> {
        const randomTtl = Math.floor(ttl + (Math.random() * 60));
        await this.#_redis.set(key,JSON.stringify(value),"EX",randomTtl);
    }

    async del(key: string): Promise<void> {
        await this.#_redis.del(key);
    }

    async acquireLock(
        resourceId: string, 
        ttlSeconds: number = 30
    ): Promise<string | null> {
        const lockKey = `lock:${resourceId}`;
        const lockToken = crypto.randomUUID();

        const result = await redis.set(
            lockKey,
            lockToken,
            "EX",
            ttlSeconds,
            "NX"
        );

        return result === "OK" ? lockToken : null;
    }

    async releaseLock(lockKey: string, lockToken: string): Promise<boolean> {
        const luaScript = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;

        const result = await redis.eval(luaScript, 1, lockKey, lockToken);
        return result === 1;
    }

}

