// services/interfaces/category.service.interface.ts
import { ICategory } from "@/db/interfaces/category.interface";
import { PaginationDTO } from "@/dtos/Pagination.dto";
import { ResponseDTO } from "@/dtos/Response.dto";
import { CreateCategoryRequestDTO } from "@/dtos/category/createCategory.dto";
import { UpdateCategoryRequestDTO } from "@/dtos/category/updateCategory.dto";
import { ArchiveCategoryRequestDTO } from "@/dtos/category/archiveCategory.dto";
import { GetCategoriesRequestDTO } from "@/dtos/category/getCategories.dto";

export interface ICategoryService {
    createCategory(
        req: CreateCategoryRequestDTO
    ): Promise<ResponseDTO<null>>;

    updateCategory(
        req: UpdateCategoryRequestDTO
    ): Promise<ResponseDTO<null>>;

    archiveCategory(
        req: ArchiveCategoryRequestDTO
    ): Promise<ResponseDTO<null>>;

    getCategory(
        id: string
    ): Promise<ResponseDTO<ICategory | null>>;

    getCategories(
        req: GetCategoriesRequestDTO
    ): Promise<PaginationDTO<ICategory>>;

    getActiveCategories(): Promise<ResponseDTO<ICategory[]>>;
}
