import { Document } from "mongoose";

export interface ICategory extends Document {
    _id? : string;
    name : string;
    slug : string;
    description : string;
    isArchived : boolean;
    isActive : boolean;
    createdAt : Date;
    updatedAt : Date;
}