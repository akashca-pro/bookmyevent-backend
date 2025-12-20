import { ICategory } from "@/db/interfaces/category.interface";
import { CreateCategoryRequestDTO } from "../category/createCategory.dto";
import { UpdateCategoryRequestDTO } from "../category/updateCategory.dto";
import { GetCategoriesRequestDTO, GetCategoriesResponseDTO } from "../category/getCategories.dto";

export class CategoryMapper {
    static toCreateCategoryRequestDTO (input : any) : CreateCategoryRequestDTO {
        return {
            name : input.name,
            slug : input.slug,
            description : input.description
        }
    }
    static toUpdateCategoryRequestDTO (categoryId : string, input : any) : UpdateCategoryRequestDTO {
        return {
            id : categoryId,
            data : {
                ...input
            }
        }
    }
    static toGetCategoriesRequestDTO (input : any) : GetCategoriesRequestDTO {
        return {
            page : input.page ?? 1,
            options : {
                limit : input.limit ?? 10,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
    }
    static toGetCategoriesResponseDTO (categories : ICategory[]) :GetCategoriesResponseDTO[] {
        const response = categories.map((category)=>{
            return {
                id : category._id!.toString(),
                name : category.name,
                slug : category.slug,
                description : category.description,
                isArchived : category.isArchived,
                isActive : category.isActive,
                createdAt : category.createdAt.toISOString(),
                updatedAt : category.updatedAt.toISOString()    
            }
        })
        return response
    }
}