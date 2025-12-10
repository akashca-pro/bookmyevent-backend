import { UserRole } from "@/const/userRoles.const";

export interface LoginRequestDTO {
    email: string;
    password: string;
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