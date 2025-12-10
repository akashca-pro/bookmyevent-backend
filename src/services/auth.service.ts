import { inject, injectable } from "inversify";
import { IAuthService } from "./interfaces/auth.service.interface";
import TYPES from "@/config/inversify/types";
import { IUserRepo } from "@/repos/interfaces/user.repo.interface";
import { ResponseDTO } from "@/dtos/Response.dto";
import logger from "@/utils/pinoLogger";
import { SERVICE_ERRORS } from "@/const/ErrorTypes.const";
import { IPasswordHasher } from "@/providers/interfaces/passwordHasher.interface";
import { ITokenPayLoad } from "@/types/token.type";
import { ITokenProvider } from "@/providers/interfaces/TokenProvider.interface";
import { SignupRequestDTO, SignupResponseDTO } from "@/dtos/auth/signup.dto";
import { LoginRequestDTO, LoginResponseDTO } from "@/dtos/auth/login.dto";


@injectable()
export class AuthService implements IAuthService {

    #_userRepo : IUserRepo;
    #_passwordHasher : IPasswordHasher;
    #_tokenProvider : ITokenProvider

    constructor(
        @inject(TYPES.IUserRepo) userRepo : IUserRepo,
        @inject(TYPES.IPasswordHasher) passwordHasher : IPasswordHasher,
        @inject(TYPES.ITokenProvider) tokenProvider : ITokenProvider,
    ){
        this.#_userRepo = userRepo;
        this.#_passwordHasher = passwordHasher;
        this.#_tokenProvider = tokenProvider;
    }

    async signup(
        req: SignupRequestDTO
    ): Promise<ResponseDTO<SignupResponseDTO | null>> {
        const method = 'AuthService.signup'
        logger.info(`[AUTH-SERVICE] ${method} started`);
        const user = await this.#_userRepo.getUserByEmail(req.email);
        if(user){
            logger.error(`[AUTH-SERVICE] ${method} user already exists`);
            return {
                data : null,
                errorMessage : SERVICE_ERRORS.USER_ALREADY_EXISTS,
                success : false
            }
        }
        const hashedPassword = await this.#_passwordHasher.hashPassword(req.password);
        req.password = hashedPassword;
        logger.info(`[AUTH-SERVICE] ${method} password hashed`);
        const newUser = await this.#_userRepo.createUser(req)
        logger.info(`[AUTH-SERVICE] ${method} user created`);
        const tokenPayload : ITokenPayLoad = {
            userId : newUser?._id!,
            email : newUser?.email!,
            name : newUser?.name!,
            role : newUser?.role!
        }
        const accessToken = this.#_tokenProvider.generateAccessToken(tokenPayload);
        if(!accessToken) {
            logger.error('Token generation error: Access token could not be issued.', { userId: newUser?._id });
            return {
                data : null,
                errorMessage : SERVICE_ERRORS.ACCESS_TOKEN_ISSUE_ERROR,
                success : false 
            }
        }
        logger.info(`[AUTH-SERVICE] ${method} access token generated`);
        return {
            data : {
                accessToken,
                user : {
                    id : newUser?._id!,
                    name : newUser?.name!,
                    email : newUser?.email!,
                    role : newUser?.role!
                }
            },
            success : true
        }
    }

    async login(
        req: LoginRequestDTO
    ): Promise<ResponseDTO<LoginResponseDTO | null>> {
        const method = 'AuthService.login'
        logger.info(`[AUTH-SERVICE] ${method} started`);
        const user = await this.#_userRepo.getUserByEmail(req.email);
        if(!user){
            logger.error(`[AUTH-SERVICE] ${method} user not found`);
            return {
                data : null,
                errorMessage : SERVICE_ERRORS.USER_NOT_FOUND,
                success : false
            }
        }
        const isPasswordValid = await this.#_passwordHasher.comparePasswords(req.password, user.password);
        if(!isPasswordValid){
            logger.error(`[AUTH-SERVICE] ${method} invalid credentials`);
            return {
                data : null,
                errorMessage : SERVICE_ERRORS.INVALID_CREDENTIALS,
                success : false
            }
        }
        logger.info(`[AUTH-SERVICE] ${method} login successful`);
        const tokenPayload : ITokenPayLoad = {
            userId : user?._id!,
            email : user?.email!,
            name : user?.name!,
            role : user?.role!
        }
        const accessToken = this.#_tokenProvider.generateAccessToken(tokenPayload);
        if(!accessToken) {
            logger.error('Token generation error: Access token could not be issued.', { userId: user?._id });
            return {
                data : null,
                errorMessage : SERVICE_ERRORS.ACCESS_TOKEN_ISSUE_ERROR,
                success : false 
            }
        }
        logger.info(`[AUTH-SERVICE] ${method} access token generated`);
        return {
            data : {
                accessToken,
                user : {
                    id : user?._id!,
                    name : user?.name!,
                    email : user?.email!,
                    role : user?.role!
                }
            },
            success : true
        }
    }
}