import { ListOptions, ServiceFilter } from "@/repos/interfaces/service.repo.interface";

export interface GetAvailableServicesRequestDTO {
    startDate : Date;
    endDate : Date;
    filter : ServiceFilter,
    options : ListOptions
}