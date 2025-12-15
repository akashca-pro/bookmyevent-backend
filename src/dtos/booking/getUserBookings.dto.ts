import { ListOptions } from "../Listoptions.dto";

export interface GetUserBookingRequestDTO {
    userId : string;
    page : number;
    options : ListOptions
}

export interface GetUserBookingResponseDTO {
    bookingDetails : {
        startDate : Date;
        endDate : Date;
        totalPrice : number;
        status : string;
    }
    serviceDetails : {
        title : string;
        description : string;
        thumbnailUrl : string | null;
    }
}