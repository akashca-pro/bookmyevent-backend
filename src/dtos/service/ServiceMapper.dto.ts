import { IBooking } from "@/db/interfaces/booking.interface";
import { ArchiveServiceRequestDTO } from "./archiveService.dto";
import { CreateServiceRequestDTO } from "./createService.dto";
import { GetAvailableServicesRequestDTO } from "./getAvailableServices.dto";
import { GetBookingByServiceRequestDTO, GetBookingsByServiceResponseDTO } from "./getBookingsByServices.dto";
import { GetServicesRequestDTO } from "./getServices.dto";
import { UpdateServiceRequestDTO } from "./updateService.dto";
import { IUser } from "@/db/interfaces/user.interface";

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
    static toUpdateServiceRequestDTO(serviceId : string, input : any, thumbnailUrl : string | null) : UpdateServiceRequestDTO {
        return {
            id : serviceId,
            data : {
                title : input.title ?? undefined,
                description : input.description ?? undefined,
                category : input.category ?? undefined,
                pricePerDay : input.pricePerDay ?? undefined,
                thumbnailUrl : thumbnailUrl ?? undefined,
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
                category : input.filter?.category,
                minPrice : input.filter?.minPrice,
                maxPrice : input.filter?.maxPrice,
                city : input.filter?.city,
                adminId : input.filter?.adminId
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
                category : input.filter?.category,
                minPrice : input.filter?.minPrice,
                maxPrice : input.filter?.maxPrice,
                city : input.filter?.city,
                adminId : input.filter?.adminId
            },
            page : input.page ?? 1,
            options : {
                limit : input.limit ?? 10,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
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
                    status : booking.status
                }
            }
        });
        return response
    }
}