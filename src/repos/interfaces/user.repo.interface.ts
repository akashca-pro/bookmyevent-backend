import { IUser } from "@/db/interfaces/user.interface";

export interface IUserRepo {
    createUser(data : Partial<IUser>) : Promise<IUser | null>;
    getUserById(id : string) : Promise<IUser | null>;
    getUserByEmail(email : string) : Promise<IUser | null>;
    getUsers() : Promise<IUser[]>;
    updateUser(id : string, data : Partial<IUser>) : Promise<boolean>;
    archieveUser(id : string) : Promise<boolean>;
}