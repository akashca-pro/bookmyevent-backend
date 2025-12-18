/**
 * Interface responsible for caching data.
 * 
 * @interface
 */
export interface ICacheProvider {
    get<T>(key : string) : Promise<T | null> 
    set<T>(key : string, value : T, ttl : number) : Promise<void>
    del(key : string) : Promise<void>
    acquireLock(resourceId : string, ttlSeconds : number) : Promise<string | null>
    releaseLock(lockKey : string, lockToken : string) : Promise<boolean>
}