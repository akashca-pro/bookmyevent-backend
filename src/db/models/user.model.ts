import mongoose, {Schema} from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { USER_ROLE } from "@/const/userRoles.const";

const UserSchema = new Schema<IUser>(
    {
        name : { type : String, required : true },
        email : { type : String, required : true, unique : true },
        password : { type : String, required : true },
        avatar : { type : String, default : null },
        isArchived : { type : Boolean, default : false },
        isBlocked : { type : Boolean, default : false },
        role : { type : String, enum : Object.values(USER_ROLE), required : true }
    },
    {timestamps : true}
)

export const UserModel = mongoose.model<IUser>('User', UserSchema);