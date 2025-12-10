import { ResponseDTO } from "@/dtos/Response.dto";
import { SignupRequestDTO, SignupResponseDTO } from "@/dtos/signup.dto";

export interface IAuthService {
    signup(req : SignupRequestDTO) : Promise<ResponseDTO<SignupResponseDTO | null>>
}