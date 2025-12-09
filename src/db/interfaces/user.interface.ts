import { UserRole } from "@/const/userRoles.const";
import { Document } from "mongoose";

export interface IUser extends Document{
    _id? : string;
    name : string;
    email : string;
    password : string;
    avatar? : string;
    isArchived : boolean;
    isBlocked : boolean;
    role : UserRole;
}