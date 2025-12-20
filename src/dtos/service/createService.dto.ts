import { IAvailability, IContact, ILocation } from "@/db/interfaces/service.interface";
import { Types } from "mongoose";

export interface CreateServiceRequestDTO {
    adminId : Types.ObjectId;
    data : {
        title : string;
        description : string;
        category : Types.ObjectId;
        pricePerDay : number;
        location : ILocation;
        availability : IAvailability;
        contact : IContact;
    }
}