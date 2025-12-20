import { UserRole } from "@/const/userRoles.const";

export interface LoginRequestDTO {
    email: string;
    password: string;
    role : UserRole;
}

export interface LoginResponseDTO {
    accessToken: string;
    user: {
        id: string;  
        name: string;
        email: string;
        role: UserRole;
    };
}