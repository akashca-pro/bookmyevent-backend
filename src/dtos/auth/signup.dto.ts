import { UserRole } from "@/const/userRoles.const";

export interface SignupRequestDTO {
    name: string;
    email: string;
    password: string;
    role : UserRole
}

export interface SignupResponseDTO {
    accessToken: string;
    user: {
        id: string;  
        name: string;
        email: string;
        role: UserRole;
    };
}