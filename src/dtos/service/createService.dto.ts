import { IAvailability, IContact, ILocation } from "@/db/interfaces/service.interface";

export interface CreateServiceRequestDTO {
    adminId : string;
    data : {
        title : string;
        description : string;
        category : string;
        pricePerDay : number;
        location : ILocation;
        availability : IAvailability;
        contact : IContact;
    }
}