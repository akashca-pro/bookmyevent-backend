import { IAvailability, IContact, ILocation } from "@/db/interfaces/service.interface";

export interface UpdateServiceRequestDTO {
    id : string;
    data : {
        title : string;
        description : string;
        category : string;
        pricePerDay : number;
        location : ILocation;
        availability : IAvailability;
        isArchived : boolean;
        contact : IContact;
    }
}