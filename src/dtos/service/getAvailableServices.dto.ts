import { ServiceFilter } from "@/repos/interfaces/service.repo.interface";
import { ListOptions } from "../Listoptions.dto";
import { CategoryPublicData } from "../category/categoryPublic.dto";

export interface GetAvailableServicesRequestDTO {
    startDate : Date;
    endDate : Date;
    filter : ServiceFilter,
    page : number;
    options : ListOptions
}

export interface GetAvailableServicesResponseDTO {
  id: string;
  title: string;
  category: CategoryPublicData;
  pricePerDay: number;
  thumbnail: string | null;
  municipality: string;
  district : string
}