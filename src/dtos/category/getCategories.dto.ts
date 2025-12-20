import { ListOptions } from "../Listoptions.dto";

export interface GetCategoriesRequestDTO {
    page : number;
    options : ListOptions
}

export interface GetCategoriesResponseDTO {
    id : string;
    name : string;
    slug : string;
    description : string;
    isArchived : boolean;
    isActive : boolean;
    createdAt : string;
    updatedAt : string;
}