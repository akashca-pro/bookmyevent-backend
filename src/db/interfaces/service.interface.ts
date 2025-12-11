import { Document, Types } from "mongoose";

export interface ILocation {
    address : string,
    city : string;
    state : string;
    pincode : string;
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
    category : string;
    pricePerDay : number;
    description : string;
    location : ILocation;
    availability : IAvailability;
    contact : IContact;
    createdAt : Date;
    updatedAt : Date;
}