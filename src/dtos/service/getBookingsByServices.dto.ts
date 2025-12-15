import { ListOptions } from "../Listoptions.dto";

export interface GetBookingByServiceRequestDTO {
    serviceId : string;
    page : number;
    options : ListOptions;
}

export interface GetBookingsByServiceResponseDTO {
    user : {
        name : string;
        email : string;
        avatar : string | null;
    },
    bookingDetails : {
        startDate : Date;
        endDate : Date;
        totalPrice : number;
        status : string;
        createdAt : Date;
        updatedAt : Date;
    }
}