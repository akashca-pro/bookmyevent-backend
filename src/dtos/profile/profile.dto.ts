import { UserRole } from "@/const/userRoles.const";

export interface ProfileResponseDTO {
    id : string;
    name : string;
    email : string;
    avatar : string | null;
    role : UserRole;
    createdAt : Date;
    updatedAt : Date;
}