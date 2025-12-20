// repos/category.repo.ts
import { BaseRepo } from "./base.repo";
import { ICategoryRepo } from "./interfaces/category.repo.interface";
import { CategoryModel } from "@/db/models/category.model";
import { ICategory } from "@/db/interfaces/category.interface";
import { ListOptions } from "@/dtos/Listoptions.dto";
import logger from "@/utils/pinoLogger";

export class CategoryRepo extends BaseRepo<ICategory> implements ICategoryRepo {
    constructor() {
        super(CategoryModel);
    }

    async createCategory(
        data: Partial<ICategory>
    ): Promise<ICategory | null> {
        const startTime = Date.now();
        const operation = "createCategory";
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.create({...data, isActive : true});
            logger.info(`[REPO] ${operation} successful`, {
                id: result._id.toString(),
                duration: Date.now() - startTime,
            });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async getCategoryById(
        id: string
    ): Promise<ICategory | null> {
        const startTime = Date.now();
        const operation = "getCategoryById";
        try {
            logger.debug(`[REPO] Executing ${operation}`, { id });
            const result = await this._model.findById(id);
            logger.info(`[REPO] ${operation} successful`, {
                found: !!result,
                duration: Date.now() - startTime,
            });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                id,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async getCategoryBySlug(
        slug: string
    ): Promise<ICategory | null> {
        const startTime = Date.now();
        const operation = "getCategoryBySlug";
        try {
            logger.debug(`[REPO] Executing ${operation}`, { slug });
            const result = await this._model.findOne({
                slug,
                isArchived: false,
            });
            logger.info(`[REPO] ${operation} successful`, {
                found: !!result,
                duration: Date.now() - startTime,
            });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                slug,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async updateCategory(
        id: string,
        data: Partial<ICategory>
    ): Promise<boolean> {
        const startTime = Date.now();
        const operation = "updateCategory";
        try {
            logger.debug(`[REPO] Executing ${operation}`, { id });
            const result = await this._model.findByIdAndUpdate(id, data);
            const updated = !!result;
            logger.info(`[REPO] ${operation} successful`, {
                id,
                updated,
                duration: Date.now() - startTime,
            });
            return updated;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                id,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async toggleArchiveStatus(
        id: string
    ): Promise<boolean> {
        const startTime = Date.now();
        const operation = "toggleArchiveStatus";
        try {
            logger.debug(`[REPO] Executing ${operation}`, { id });

            const category = await this._model
                .findById(id)
                .select("isArchived");

            if (!category) {
                logger.warn(`[REPO] ${operation} category not found`, { id });
                return false;
            }

            const nextIsArchived = !category.isArchived;

            const result = await this._model.updateOne(
                { _id: id },
                { $set: { isArchived: nextIsArchived } }
            );

            const updated = result.modifiedCount === 1;

            logger.info(`[REPO] ${operation} successful`, {
                id,
                previous: category.isArchived,
                current: nextIsArchived,
                updated,
                duration: Date.now() - startTime,
            });

            return updated;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                id,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async getCategories(
        options: ListOptions
    ): Promise<ICategory[]> {
        const startTime = Date.now();
        const operation = "getCategories";
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model
                .find({ isArchived: false })
                .skip(options.skip)
                .limit(options.limit)
                .sort(options.sort);

            logger.info(`[REPO] ${operation} successful`, {
                count: result.length,
                duration: Date.now() - startTime,
            });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async getActiveCategories(): Promise<ICategory[]> {
        const startTime = Date.now();
        const operation = "getActiveCategories";
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const result = await this._model.find({
                isArchived: false,
                isActive: true,
            });
            logger.info(`[REPO] ${operation} successful`, {
                count: result.length,
                duration: Date.now() - startTime,
            });
            return result;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async existsBySlug(
        slug: string
    ): Promise<boolean> {
        const startTime = Date.now();
        const operation = "existsBySlug";
        try {
            logger.debug(`[REPO] Executing ${operation}`, { slug });
            const result = await this._model.exists({ slug });
            const exists = !!result;
            logger.info(`[REPO] ${operation} successful`, {
                exists,
                duration: Date.now() - startTime,
            });
            return exists;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                slug,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async countCategories(): Promise<number> {
        const startTime = Date.now();
        const operation = "countCategories";
        try {
            logger.debug(`[REPO] Executing ${operation}`);
            const count = await this._model.countDocuments({
                isArchived: false,
            });
            logger.info(`[REPO] ${operation} successful`, {
                count,
                duration: Date.now() - startTime,
            });
            return count;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }

    async deleteCategory(id : string) : Promise<boolean> {
        const startTime = Date.now();
        const operation = 'deleteCategory';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { id });
            const result = await this._model.findByIdAndDelete(id);
            const deleted = !!result
            return deleted
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                duration: Date.now() - startTime,
            });
            throw error;
        }
    }
}
