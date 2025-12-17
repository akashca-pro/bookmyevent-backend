import { CreateCategoryRequestDTO } from "./createCategory.dto";
import { UpdateCategoryRequestDTO } from "./updateCategory.dto";

export class CategoryMapper {
    static toCreateCategoryRequestDTO (input : any) : CreateCategoryRequestDTO {
        return {
            name : input.name,
            slug : input.slug,
            description : input.description
        }
    }
    static toUpdateCategoryRequestDTO (input : any, categoryId : string) : UpdateCategoryRequestDTO {
        return {
            id : categoryId,
            data : {
                ...input
            }
        }
    }
    static toGetCategoriesRequestDTO (input : any) {
        return {
            page : input.page ?? 1,
            options : {
                limit : input.limit ?? 10,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
    }
}