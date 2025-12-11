import { ServiceFilter } from "@/repos/interfaces/service.repo.interface";
import { ListOptions } from "../Listoptions.dto";

export interface GetServicesRequestDTO {
    page : number;
    filter : ServiceFilter,
    options : ListOptions
}