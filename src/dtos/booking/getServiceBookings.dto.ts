import { ListOptions } from "../Listoptions.dto";

export interface GetServiceBookingsRequestDTO {
    serviceId : string;
    adminId : string;
    page : number;
    options : ListOptions
}