import { IUser } from "@/db/interfaces/user.interface";
import { BaseRepo } from "./base.repo";
import { UserModel } from "@/db/models/user.model";

export class UserRepo extends BaseRepo<IUser> {
    constructor(){
        super(UserModel)
    }
}