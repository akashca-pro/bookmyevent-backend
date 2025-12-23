import { IBooking } from "@/db/interfaces/booking.interface";
import { ArchiveServiceRequestDTO } from "../service/archiveService.dto";
import { CreateServiceRequestDTO } from "../service/createService.dto";
import { GetAvailableServicesRequestDTO, GetAvailableServicesResponseDTO } from "../service/getAvailableServices.dto";
import { GetBookingByServiceRequestDTO, GetBookingsByServiceResponseDTO } from "../service/getBookingsByServices.dto";
import { GetServicesRequestDTO, GetServicesResponseDTO } from "../service/getServices.dto";
import { UpdateServiceRequestDTO } from "../service/updateService.dto";
import { IUser } from "@/db/interfaces/user.interface";
import { IService } from "@/db/interfaces/service.interface";
import { Types } from "mongoose";

export class ServiceMapper {
    static toCreateServiceRequestDTO(adminId : string, input : any) : CreateServiceRequestDTO {
        return {
            adminId : new Types.ObjectId(adminId),
            data : {
                title : input.title,
                description : input.description,
                category : new Types.ObjectId(input.category),
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
                category : input.category ? new Types.ObjectId(input.category) : undefined,
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
                municipality : input?.municipality,
                district : input?.district,
                adminId : input?.adminId,
                search : input?.search
            },
            options : {
                limit : input.limit ?? 6,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
    }
    static toGetServicesResponseDTO(services : IService[]) : GetServicesResponseDTO[] {
        const response : GetServicesResponseDTO[] = services.map((service)=>{
            const category = service.category as unknown as { name : string, slug : string, _id : string };
            if (!category || !category._id) {
                throw new Error("Category not populated in getAvailableServices");
            }
            return {
                id: service._id!.toString(),
                adminId: service.adminId.toString(),
                title: service.title,
                description: service.description,
                category: {
                    id: category._id.toString(),
                    name: category.name,
                    slug: category.slug,
                },
                pricePerDay: service.pricePerDay,
                thumbnail: service.thumbnail,
                location: service.location,
                availability: {
                    from: service.availability.from.toISOString(),
                    to: service.availability.to.toISOString(),
                },
                contact: service.contact,
                isArchived: service.isArchived,
                isActive: service.isActive,
                createdAt: service.createdAt.toISOString(),
                updatedAt: service.updatedAt.toISOString(),
            }
        })
        return response
    }
    static toGetAvailableServicesRequestDTO(input : any) : GetAvailableServicesRequestDTO {
        return {
            startDate : input.startDate,
            endDate : input.endDate,
            filter : {
                category : input?.category,
                minPrice : input?.minPrice,
                maxPrice : input?.maxPrice,
                district : input?.district,
                municipality : input?.municipality,
                adminId : input?.adminId,
                search : input?.search
            },
            page : input.page ?? 1,
            options : {
                limit : input.limit ?? 6,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
    }
    static toGetAvailableServicesResponseDTO(services : IService[]) : GetAvailableServicesResponseDTO[] {
        const response : GetAvailableServicesResponseDTO[] = services.map((service)=>{
            const category = service.category as unknown as { name : string, slug : string, _id : string };
            if (!category || !category._id) {
                throw new Error("Category not populated in getAvailableServices");
            }
            return {
                id : service._id!.toString(),
                title : service.title,
                category : {
                    id : category._id.toString(),
                    name : category.name,
                    slug : category.slug
                },
                pricePerDay : service.pricePerDay,
                thumbnail : service.thumbnail,
                municipality : service.location.municipality,
                district : service.location.district,
            }
        });
        return response;
    }
    static toGetBookingsByServiceRequestDTO(input : any, serviceId : string) : GetBookingByServiceRequestDTO {
        return {
            serviceId : serviceId,
            page : input.page ?? 1,
            filter : {
                status : input.status ?? undefined
            },
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