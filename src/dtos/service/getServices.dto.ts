import { ListOptions, ServiceFilter } from "@/repos/interfaces/service.repo.interface";

export interface GetServicesRequestDTO {
    filter : ServiceFilter,
    options : ListOptions
}