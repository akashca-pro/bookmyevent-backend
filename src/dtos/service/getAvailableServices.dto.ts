import { ServiceFilter } from "@/repos/interfaces/service.repo.interface";
import { ListOptions } from "../Listoptions.dto";

export interface GetAvailableServicesRequestDTO {
    startDate : Date;
    endDate : Date;
    filter : ServiceFilter,
    page : number;
    options : ListOptions
}

export interface GetAvailableServicesResponseDTO {
    title : string;
    category : string;
    pricePerDay : number;
    thumbnailUrl : string | null;
}