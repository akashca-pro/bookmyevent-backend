import { APP_ERRORS } from "@/const/ErrorTypes.const";
import { USER_ROLE, UserRole } from "@/const/userRoles.const";
import { SignupRequestDTO } from "./signup.dto";

export class AuthMapper {
    static toSignupService(req : Record<string, any>, role : string = USER_ROLE.USER) : SignupRequestDTO {
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