import { Document, Types } from "mongoose";

export interface ILocation {
    address: string;
    district: string;
    municipality: string;
    pincode: string;
}

export interface IAvailability {
    from : Date;
    to : Date;
}

export interface IContact {
    phone: string,
    email: string
}

export interface IService extends Document {
    _id? : string;
    adminId : Types.ObjectId;
    title : string;
    category : Types.ObjectId;
    pricePerDay : number;
    description : string;
    thumbnail : string | null;
    location : ILocation;
    availability : IAvailability;
    contact : IContact;
    isArchived : boolean;
    isActive : boolean;
    createdAt : Date;
    updatedAt : Date;
}