import { ListOptions } from "../Listoptions.dto";

export interface GetUserBookingRequestDTO {
    userId : string;
    page : number;
    filter : {
        status? : string;
    }
    options : ListOptions
}

export interface GetUserBookingResponseDTO {
    bookingDetails : {
        startDate : Date;
        endDate : Date;
        totalPrice : number;
        status : string;
        createdAt : Date;
        updatedAt : Date;
    }
    serviceDetails : {
        title : string;
        description : string;
        thumbnail : string | null;
    }
}