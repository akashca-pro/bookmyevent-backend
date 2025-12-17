import { IBooking } from "@/db/interfaces/booking.interface";
import { ArchiveServiceRequestDTO } from "./archiveService.dto";
import { CreateServiceRequestDTO } from "./createService.dto";
import { GetAvailableServicesRequestDTO, GetAvailableServicesResponseDTO } from "./getAvailableServices.dto";
import { GetBookingByServiceRequestDTO, GetBookingsByServiceResponseDTO } from "./getBookingsByServices.dto";
import { GetServicesRequestDTO } from "./getServices.dto";
import { UpdateServiceRequestDTO } from "./updateService.dto";
import { IUser } from "@/db/interfaces/user.interface";
import { IService } from "@/db/interfaces/service.interface";

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
    static toUpdateServiceRequestDTO(serviceId : string, input : any, thumbnail : string | null) : UpdateServiceRequestDTO {
        return {
            id : serviceId,
            data : {
                title : input.title ?? undefined,
                description : input.description ?? undefined,
                category : input.category ?? undefined,
                pricePerDay : input.pricePerDay ?? undefined,
                thumbnail : thumbnail ?? undefined,
                location : input.location ?? undefined,
                availability : input.availability ?? undefined,
                contact : input.contact ?? undefined,
                isArchived: Object.prototype.hasOwnProperty.call(input, 'isArchived')
                    ? Boolean(input.isArchived)
                    : undefined,

                isActive: Object.prototype.hasOwnProperty.call(input, 'isActive')
                    ? Boolean(input.isActive)
                    : undefined,
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
            page : input.page ?? 1,
            filter : {
                category : input?.category,
                minPrice : input?.minPrice,
                maxPrice : input?.maxPrice,
                city : input?.city,
                adminId : input?.adminId,
                search : input?.search
            },
            options : {
                limit : input.limit ?? 10,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
    }
    static toGetAvailableServicesRequestDTO(input : any) : GetAvailableServicesRequestDTO {
        return {
            startDate : input.startDate,
            endDate : input.endDate,
            filter : {
                category : input?.category,
                minPrice : input?.minPrice,
                maxPrice : input?.maxPrice,
                city : input?.city,
                adminId : input?.adminId,
                search : input?.search
            },
            page : input.page ?? 1,
            options : {
                limit : input.limit ?? 10,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
    }
    static toGetAvailableServicesResponseDTO(services : IService[]) : GetAvailableServicesResponseDTO[] {
        const response : GetAvailableServicesResponseDTO[] = services.map((service)=>{
            return {
                id : service._id!,
                title : service.title,
                category : service.category,
                pricePerDay : service.pricePerDay,
                thumbnail : service.thumbnail,
                city : service.location.city
            }
        });
        return response;
    }
    static toGetBookingsByServiceRequestDTO(input : any) : GetBookingByServiceRequestDTO {
        return {
            serviceId : input.serviceId,
            page : input.page ?? 1,
            options : {
                limit : input.limit ?? 10,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
    }
    static toGetBookingsByServiceResponseDTO(bookings : (IBooking & { userId: Partial<IUser> })[]) : GetBookingsByServiceResponseDTO[] {
        const response : GetBookingsByServiceResponseDTO[] = bookings.map((booking)=>{
            const user = booking.userId as { name : string, email : string, avatar : string | null };
            return {
                user,
                bookingDetails : {
                    startDate : booking.startDate,
                    endDate : booking.endDate,
                    totalPrice : booking.totalPrice,
                    status : booking.status,
                    createdAt : booking.createdAt,
                    updatedAt : booking.updatedAt
                }
            }
        });
        return response
    }
}