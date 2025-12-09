import { ResponseDTO } from "@/dtos/Response.dto";

export interface IAuthService {
    signup(req : Record<string, any>) : Promise<ResponseDTO>
}