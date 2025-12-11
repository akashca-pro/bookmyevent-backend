import { ProfileResponseDTO } from "@/dtos/profile/profile.dto";
import { ResponseDTO } from "@/dtos/Response.dto";


export interface IProfileService {
    profile(userId : string) : Promise<ResponseDTO<ProfileResponseDTO | null>>
}