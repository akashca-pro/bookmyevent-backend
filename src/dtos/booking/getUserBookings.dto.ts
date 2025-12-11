import { ListOptions } from "../Listoptions.dto";

export interface GetUserBookingRequestDTO {
    userId : string;
    page : number;
    options : ListOptions
}