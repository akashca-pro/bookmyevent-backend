import { ArchiveServiceRequestDTO } from "./archiveService.dto";
import { CreateServiceRequestDTO } from "./createService.dto";
import { GetAvailableServicesRequestDTO } from "./getAvailableServices.dto";
import { GetServicesRequestDTO } from "./getServices.dto";
import { UpdateServiceRequestDTO } from "./updateService.dto";

export class ServiceMapper {
    static toCreateServiceRequestDTO(adminId : string, input : any) : CreateServiceRequestDTO {
        return {
            adminId,
            data : {
                title : input.title,
                description : input.description,
                category : input.category,
                pricePerDay : input.pricePerDay,
                location : input.location,
                availability : input.availability,
                contact : input.contact
            }
        }
    }
    static toUpdateServiceRequestDTO(serviceId : string, input : any) : UpdateServiceRequestDTO {
        return {
            id : serviceId,
            data : {
                title : input.title,
                description : input.description,
                category : input.category,
                pricePerDay : input.pricePerDay,
                location : input.location,
                availability : input.availability,
                contact : input.contact,
                isArchived : true
            }
        }
    }
    static toArchiveServiceRequestDTO(serviceId : string, userId : string) : ArchiveServiceRequestDTO {
        return {
            id : serviceId,
            adminId : userId
        }
    }
    static toGetServicesRequestDTO(input : any) : GetServicesRequestDTO{
        return {
            page : input.page,
            filter : {
                category : input.filter?.category,
                minPrice : input.filter?.minPrice,
                maxPrice : input.filter?.maxPrice,
                city : input.filter?.city,
                adminId : input.filter?.adminId
            },
            options : {
                limit : input.options?.limit,
                skip : input.options?.skip,
                sort : input.options?.sort
            }
        }
    }
    static toGetAvailableServicesRequestDTO(input : any) : GetAvailableServicesRequestDTO {
        return {
            startDate : input.startDate,
            endDate : input.endDate,
            filter : {
                category : input.filter?.category,
                minPrice : input.filter?.minPrice,
                maxPrice : input.filter?.maxPrice,
                city : input.filter?.city,
                adminId : input.filter?.adminId
            },
            page : input.page,
            options : {
                limit : input.options?.limit,
                skip : input.options?.skip,
                sort : input.options?.sort
            }
        }
    }
}