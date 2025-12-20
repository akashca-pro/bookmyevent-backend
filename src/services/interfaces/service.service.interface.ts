import { IService } from "@/db/interfaces/service.interface";
import { PaginationDTO } from "@/dtos/Pagination.dto";
import { ResponseDTO } from "@/dtos/Response.dto";
import { ArchiveServiceRequestDTO } from "@/dtos/service/archiveService.dto";
import { CreateServiceRequestDTO } from "@/dtos/service/createService.dto";
import { GetAvailableServicesRequestDTO, GetAvailableServicesResponseDTO } from "@/dtos/service/getAvailableServices.dto";
import { GetBookingByServiceRequestDTO, GetBookingsByServiceResponseDTO } from "@/dtos/service/getBookingsByServices.dto";
import { GetServicesRequestDTO, GetServicesResponseDTO } from "@/dtos/service/getServices.dto";
import { UpdateServiceRequestDTO } from "@/dtos/service/updateService.dto";


export interface IServiceService {
    createService(
        req : CreateServiceRequestDTO
    ) : Promise<ResponseDTO<null>>

    updateService(
        req : UpdateServiceRequestDTO
    ) : Promise<ResponseDTO<null>>

    getService(
        id : string
    ) : Promise<ResponseDTO<IService | null>>;

    getServices(
        req : GetServicesRequestDTO
    ) : Promise<PaginationDTO<GetServicesResponseDTO>>;

    getAvailableServices(
        req : GetAvailableServicesRequestDTO
    ) : Promise<PaginationDTO<GetAvailableServicesResponseDTO>>

    getBookingsByService(
        req : GetBookingByServiceRequestDTO
    ) : Promise<PaginationDTO<GetBookingsByServiceResponseDTO>>
}