import { ServiceFilter } from "@/repos/interfaces/service.repo.interface";
import { ListOptions } from "../Listoptions.dto";

export interface GetAvailableServicesRequestDTO {
    startDate : Date;
    endDate : Date;
    filter : ServiceFilter,
    page : number;
    options : ListOptions
}