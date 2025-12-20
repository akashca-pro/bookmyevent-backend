import { IAvailability, IContact, ILocation } from "@/db/interfaces/service.interface";
import { Types } from "mongoose";

export interface UpdateServiceRequestDTO {
    id : string;
    data : {
        title? : string;
        description? : string;
        category? : Types.ObjectId;
        pricePerDay? : number;
        thumbnail? : string;
        location? : ILocation;
        availability? : IAvailability;
        isArchived? : boolean;
        isActive? : boolean;
        contact? : IContact;
    }
}