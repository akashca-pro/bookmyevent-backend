import { ServiceFilter } from "@/repos/interfaces/service.repo.interface";
import { ListOptions } from "../Listoptions.dto";
import { IContact, ILocation } from "@/db/interfaces/service.interface";
import { CategoryPublicData } from "../category/categoryPublic.dto";

export interface GetServicesRequestDTO {
    page : number;
    filter : ServiceFilter,
    options : ListOptions
}

export interface GetServicesResponseDTO {
    id: string;
    adminId: string;
    title: string;
    description: string;
    category: CategoryPublicData;
    pricePerDay: number;
    thumbnail: string | null;
    location: ILocation;
    availability: {
        from: string;
        to: string;   
    };
    contact: IContact;
    isArchived: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string; 
}
