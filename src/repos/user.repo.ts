import { IUser } from "@/db/interfaces/user.interface";
import { BaseRepo } from "./base.repo";
import { UserModel } from "@/db/models/user.model";
import { IUserRepo } from "./interfaces/user.repo.interface";
import logger from "@/utils/pinoLogger";

export class UserRepo extends BaseRepo<IUser> implements IUserRepo{
    constructor(){
        super(UserModel)
    }

    async createUser(data : Partial<IUser>) : Promise<IUser | null> {
        const startTime = Date.now();
        const operation = 'createUser';
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

    async getUserById(id : string) : Promise<IUser | null> {
        const startTime = Date.now();
        const operation = 'getUserById';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { id });
            const result = await this._model.findById(id);
            const found = !!result;
            logger.info(`[REPO] ${operation} successful`, { found, id, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, id, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getUserByEmail(email : string) : Promise<IUser | null> {
        const startTime = Date.now();
        const operation = 'getUserByEmail';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { email });
            const result = await this._model.findOne({ email });
            const found = !!result;
            logger.info(`[REPO] ${operation} successful`, { found, email, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, email, duration: Date.now() - startTime });
            throw error;
        }
    }

    async getUsers() : Promise<IUser[]> {
        const startTime = Date.now();
        const operation = 'getUsers';
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.find();
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async updateUser(id : string, data : Partial<IUser>) : Promise<boolean> {
        const startTime = Date.now();
        const operation = 'updateUser';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { id, dataKeys: Object.keys(data) });
            const result = await this._model.findByIdAndUpdate(id, data, {new : false});
            const updated = !!result;
            logger.info(`[REPO] ${operation} successful`, { updated, id, duration: Date.now() - startTime });
            return updated
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

    async archieveUser(id: string): Promise<boolean> {
        const startTime = Date.now();
        const operation = 'archieveUser';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { id });
            const result = await this._model.findByIdAndUpdate(id, { isArchived: true },{ new : false });
            const updated = !!result;
            return updated
        }catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, duration: Date.now() - startTime });
            throw error;
        }
    }

}