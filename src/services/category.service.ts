// services/category.service.ts
import { inject, injectable } from "inversify";
import TYPES from "@/config/inversify/types";
import logger from "@/utils/pinoLogger";

import { ICategoryService } from "./interfaces/category.service.interface";
import { ICategoryRepo } from "@/repos/interfaces/category.repo.interface";
import { ICacheProvider } from "@/providers/interfaces/cacheProvider.interface";

import { ResponseDTO } from "@/dtos/Response.dto";
import { PaginationDTO } from "@/dtos/Pagination.dto";

import { ICategory } from "@/db/interfaces/category.interface";
import { CreateCategoryRequestDTO } from "@/dtos/category/createCategory.dto";
import { UpdateCategoryRequestDTO } from "@/dtos/category/updateCategory.dto";
import { GetCategoriesRequestDTO, GetCategoriesResponseDTO } from "@/dtos/category/getCategories.dto";

import { CATEGORY_SERVICE_ERRORS } from "@/const/ErrorTypes.const";
import { REDIS_KEY_PREFIX } from "@/config/redis/keyPrefix";
import { config } from "@/config";
import { CategoryMapper } from "@/dtos/category/categoryMapper.dto";

@injectable()
export class CategoryService implements ICategoryService {

    #_categoryRepo: ICategoryRepo;
    #_cacheProvider: ICacheProvider;

    constructor(
        @inject(TYPES.ICategoryRepo) categoryRepo: ICategoryRepo,
        @inject(TYPES.ICacheProvider) cacheProvider: ICacheProvider
    ) {
        this.#_categoryRepo = categoryRepo;
        this.#_cacheProvider = cacheProvider;
    }

    async createCategory(
        req: CreateCategoryRequestDTO
    ): Promise<ResponseDTO<null>> {
        const method = "CategoryService.createCategory";
        logger.info(`[CATEGORY-SERVICE] ${method} started`);

        const slugExists = await this.#_categoryRepo.existsBySlug(req.slug);
        if (slugExists) {
            logger.error(`[CATEGORY-SERVICE] ${method} slug already exists`);
            return {
                data: null,
                success: false,
                errorMessage: CATEGORY_SERVICE_ERRORS.CATEGORY_SLUG_ALREADY_EXISTS,
            };
        }

        const category = await this.#_categoryRepo.createCategory(req);
        if (!category) {
            logger.error(`[CATEGORY-SERVICE] ${method} creation failed`);
            return {
                data: null,
                success: false,
                errorMessage: CATEGORY_SERVICE_ERRORS.CATEGORY_CREATION_FAILED,
            };
        }

        return {
            data: null,
            success: true,
        };
    }

    async updateCategory(
        req: UpdateCategoryRequestDTO
    ): Promise<ResponseDTO<null>> {
        const method = "CategoryService.updateCategory";
        logger.info(`[CATEGORY-SERVICE] ${method} started`);
        const exists = await this.#_categoryRepo.getCategoryById(req.id);
        if (!exists) {
            logger.error(`[CATEGORY-SERVICE] ${method} category not found`);
            return {
                data: null,
                success: false,
                errorMessage: CATEGORY_SERVICE_ERRORS.CATEGORY_NOT_FOUND,
            };
        }
        const updated = await this.#_categoryRepo.updateCategory(req.id, req.data);
        if (!updated) {
            return {
                data: null,
                success: false,
                errorMessage: CATEGORY_SERVICE_ERRORS.CATEGORY_UPDATION_FAILED,
            };
        }

        await this.#_cacheProvider.del(`${REDIS_KEY_PREFIX.CATEGORY}${req.id}`);

        return {
            data: null,
            success: true,
        };
    }

    async archiveCategory(
        id : string
    ): Promise<ResponseDTO<null>> {
        const method = "CategoryService.archiveCategory";
        logger.info(`[CATEGORY-SERVICE] ${method} started`, { categoryId: id });

        const category = await this.#_categoryRepo.getCategoryById(id);
        if (!category) {
            logger.error(`[CATEGORY-SERVICE] ${method} category not found`);
            return {
                data: null,
                success: false,
                errorMessage: CATEGORY_SERVICE_ERRORS.CATEGORY_NOT_FOUND,
            };
        }

        const updated = await this.#_categoryRepo.toggleArchiveStatus(id);
        if (!updated) {
            return {
                data: null,
                success: false,
                errorMessage: CATEGORY_SERVICE_ERRORS.CATEGORY_ARCHIVING_FAILED,
            };
        }

        await this.#_cacheProvider.del(`${REDIS_KEY_PREFIX.CATEGORY}${id}`);

        return {
            data: null,
            success: true,
        };
    }

    async getCategory(
        id: string
    ): Promise<ResponseDTO<ICategory | null>> {
        const method = "CategoryService.getCategory";
        logger.info(`[CATEGORY-SERVICE] ${method} started`);

        const cacheKey = `${REDIS_KEY_PREFIX.CATEGORY}${id}`;
        const cached = await this.#_cacheProvider.get(cacheKey) as ICategory;

        if (cached) {
            logger.info(`[CATEGORY-SERVICE] ${method} fetched from cache`);
            return {
                data: cached,
                success: true,
            };
        }

        const category = await this.#_categoryRepo.getCategoryById(id);
        if (!category) {
            return {
                data: null,
                success: false,
                errorMessage: CATEGORY_SERVICE_ERRORS.CATEGORY_NOT_FOUND,
            };
        }

        await this.#_cacheProvider.set(
            cacheKey,
            category,
            config.CATEGORY_CACHE_EXPIRY
        );

        return {
            data: category,
            success: true,
        };
    }

    async getCategories(
        req: GetCategoriesRequestDTO
    ): Promise<PaginationDTO<GetCategoriesResponseDTO>> {
        const method = "CategoryService.getCategories";
        logger.info(`[CATEGORY-SERVICE] ${method} started`);

        const skip = (req.page - 1) * req.options.limit;

        const [categories, total] = await Promise.all([
            this.#_categoryRepo.getCategories({ ...req.options, skip }),
            this.#_categoryRepo.countCategories(),
        ]);
        logger.info(`[CATEGORY-SERVICE] ${method} categories fetched`);
        const response = CategoryMapper.toGetCategoriesResponseDTO(categories);
        return {
            data: response,
            total,
            page: req.page,
            limit: req.options.limit,
        };
    }

    async getActiveCategories(): Promise<ResponseDTO<ICategory[]>> {
        const method = "CategoryService.getActiveCategories";
        logger.info(`[CATEGORY-SERVICE] ${method} started`);

        const categories = await this.#_categoryRepo.getActiveCategories();

        return {
            data: categories,
            success: true,
        };
    }

    async deleteCategory(
        id: string
    ): Promise<ResponseDTO<null>> {
        const method = 'CategoryService.deleteCategory';
        logger.info(`[CATEGORY-SERVICE] ${method} started`);
        await this.#_categoryRepo.deleteCategory(id);
        return {
            data : null,
            success : true
        }
    }

}
