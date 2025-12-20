import { Types } from "mongoose";

export interface ReserveBookingRequestDTO {
    userId : Types.ObjectId;
    serviceId : Types.ObjectId;
    startDate : Date;
    endDate : Date;
}

export interface ReserveBookingResponseDTO {
    id : string;
    startDate : Date;
    endDate : Date;
    totalPrice : number;
    createdAt : Date;
    updatedAt : Date;
}
