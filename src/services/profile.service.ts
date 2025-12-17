import { inject, injectable } from "inversify";
import { IProfileService } from "./interfaces/profile.service.interface";
import { IUserRepo } from "@/repos/interfaces/user.repo.interface";
import { ICacheProvider } from "@/providers/interfaces/cacheProvider.interface";
import TYPES from "@/config/inversify/types";
import { ProfileResponseDTO } from "@/dtos/profile/profile.dto";
import { ResponseDTO } from "@/dtos/Response.dto";
import { REDIS_KEY_PREFIX } from "@/config/redis/keyPrefix";
import logger from "@/utils/pinoLogger";
import { AUTH_SERVICE_ERRORS } from "@/const/ErrorTypes.const";
import { config } from "@/config";

@injectable()
export class ProfileService implements IProfileService {

    #_userRepo : IUserRepo;
    #_cacheProvider : ICacheProvider;

    constructor(
        @inject(TYPES.IUserRepo) userRepo : IUserRepo,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider,
    ){
        this.#_userRepo = userRepo;
        this.#_cacheProvider = cacheProvider;
    }

    async profile(
        userId: string
    ): Promise<ResponseDTO<ProfileResponseDTO | null>> {
        const method = 'ProfileService.profile'
        logger.info(`[PROFILE-SERVICE] ${method} started`);
        const cacheKey = `${REDIS_KEY_PREFIX}${userId}`;
        const cachedData = await this.#_cacheProvider.get(cacheKey) as ProfileResponseDTO;
        if(cachedData){
            logger.info(`[PROFILE-SERVICE] ${method} data fetched from cache`);
            return {
                data : cachedData,
                success : true
            }
        }
        const user = await this.#_userRepo.getUserById(userId);
        if(!user){
            logger.error(`[PROFILE-SERVICE] ${method} user not found`);
            return {
                data : null,
                errorMessage : AUTH_SERVICE_ERRORS.USER_NOT_FOUND,
                success : false
            }
        }
        logger.info(`[PROFILE-SERVICE] ${method} data fetched from db`);
        const response : ProfileResponseDTO = {
            id : user._id!,
            name : user.name,
            email : user.email,
            avatar : user.avatar ?? null,
            role : user.role,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt,
        }
        await this.#_cacheProvider.set(cacheKey, response, config.PROFILE_CACHE_EXPIRY)
        return {
            data : response,
            success : true
        }
    }
}