import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import logger from '@/utils/pinoLogger'; 

/**
 * Abstract base class for a generic repository.
 */
export abstract class BaseRepo <T extends Document> {

    protected _model : Model<T>;

    constructor(model : Model<T>){
        this._model = model;
    }

    async create(data : Partial<T>) : Promise<T> {
        const startTime = Date.now();
        const operation = `create:${this._model.modelName}`;
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

    async findById(documentId : string) : Promise<T | null> {
        const startTime = Date.now();
        const operation = `findById:${this._model.modelName}`;
        try {
            logger.debug(`[REPO] Executing ${operation}`, { documentId });
            const result = await this._model.findById(documentId)
            const found = !!result;
            logger.info(`[REPO] ${operation} successful`, { found, documentId, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, documentId, duration: Date.now() - startTime });
            throw error;
        }
    }

    async findOne(filter : FilterQuery<T>) : Promise<T | null> {
        const startTime = Date.now();
        const operation = `findOne:${this._model.modelName}`;
        try {
            logger.debug(`[REPO] Executing ${operation}`, { filter });
            const result = await this._model.findOne(filter);
            const found = !!result;
            logger.info(`[REPO] ${operation} successful`, { found, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, filter, duration: Date.now() - startTime });
            throw error;
        }
    }

    async find(filter : FilterQuery<T>) : Promise<T[]> {
        const startTime = Date.now();
        const operation = `find:${this._model.modelName}`;
        try {
            logger.debug(`[REPO] Executing ${operation}`, { filter });
            const result = await this._model.find(filter)
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, filter, duration: Date.now() - startTime });
            throw error;
        }
    }

    async findPaginated(
        filter : FilterQuery<T>,
        skip : number,
        limit : number,
        sort : Record<string, 1 | -1 > = { createdAt : -1 }
    ) : Promise<T[]> {
        const startTime = Date.now();
        const operation = `findPaginated:${this._model.modelName}`;
        try {
            logger.debug(`[REPO] Executing ${operation}`, { skip, limit, filter, sort });
            const result = await this._model.find(filter).skip(skip).limit(limit).sort(sort).exec();
            logger.info(`[REPO] ${operation} successful`, { count: result.length, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, filter, duration: Date.now() - startTime });
            throw error;
        }
    }

    async update(documentId : string, update : UpdateQuery<T>) : Promise<T | null> {
        const startTime = Date.now();
        const operation = `update:${this._model.modelName}`;
        try {
            logger.debug(`[REPO] Executing ${operation}`, { documentId, updateKeys: Object.keys(update) });
            const result = await this._model.findByIdAndUpdate(documentId, update, { new : true });
            const updated = !!result;
            logger.info(`[REPO] ${operation} successful`, { updated, documentId, duration: Date.now() - startTime });
            return result as unknown as T | null; 
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, documentId, duration: Date.now() - startTime });
            throw error;
        }
    }

    async countDocuments(filter : FilterQuery<T>) : Promise<number> {
        const startTime = Date.now();
        const operation = `countDocuments:${this._model.modelName}`;
        try {
            logger.debug(`[REPO] Executing ${operation}`, { filter });
            const count = await this._model.countDocuments(filter);
            logger.info(`[REPO] ${operation} successful`, { count, duration: Date.now() - startTime });
            return count;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, filter, duration: Date.now() - startTime });
            throw error;
        }
    }

    async delete(documentId: string): Promise<T | null> {
        const startTime = Date.now();
        const operation = `delete:${this._model.modelName}`;
        try {
            logger.warn(`[REPO] Executing ${operation} (HARD DELETE)`, { documentId });
            const result = await this._model.findByIdAndDelete(documentId).exec();
            const deleted = !!result;
            logger.info(`[REPO] ${operation} successful`, { deleted, documentId, duration: Date.now() - startTime });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, documentId, duration: Date.now() - startTime });
            throw error;
        }
    }
}