import { APP_ERRORS } from "@/const/ErrorTypes.const";
import { USER_ROLE, UserRole } from "@/const/userRoles.const";

export class AuthMapper {
    static toSignupService(req : Record<string, any>, role : string) : ISignupRequestDTO {
        switch (role) {
            case USER_ROLE.USER:
                return { name : req.name, email : req.email, password : req.password, role : USER_ROLE.USER }
            case USER_ROLE.ADMIN:
                return { name : req.name, email : req.email, password : req.password, role : USER_ROLE.ADMIN }
            default:
                throw new Error(APP_ERRORS.INVALID_USER_ROLE)
        }
    }  
}

interface ISignupRequestDTO {
    name : string;
    email : string;
    password : string;
    role : UserRole
}