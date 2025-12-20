import { ResponseDTO } from "@/dtos/Response.dto";
import { LoginRequestDTO, LoginResponseDTO } from "@/dtos/auth/login.dto";
import { SignupRequestDTO, SignupResponseDTO } from "@/dtos/auth/signup.dto";

export interface IAuthService {
    signup(req : SignupRequestDTO) : Promise<ResponseDTO<SignupResponseDTO | null>>;
    login(req : LoginRequestDTO) : Promise<ResponseDTO<LoginResponseDTO | null>>;
}