import { IAvailability, IContact, ILocation } from "@/db/interfaces/service.interface";

export interface UpdateServiceRequestDTO {
    id : string;
    data : {
        title? : string;
        description? : string;
        category? : string;
        pricePerDay? : number;
        thumbnailUrl? : string;
        location? : ILocation;
        availability? : IAvailability;
        isArchived? : boolean;
        isActive? : boolean;
        contact? : IContact;
    }
}