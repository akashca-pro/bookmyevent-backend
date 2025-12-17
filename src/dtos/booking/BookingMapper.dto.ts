import { IBooking } from "@/db/interfaces/booking.interface";
import { CancelBookingRequestDTO } from "./cancelBooking.dto";
import { CheckAvailabilityRequestDTO } from "./checkAvailability.dto";
import { CreateBookingRequestDTO } from "./createBooking.dto";
import { GetUserBookingRequestDTO, GetUserBookingResponseDTO } from "./getUserBookings.dto";
import { IService } from "@/db/interfaces/service.interface";
import { GetMonthlyAvailabilityDTO } from "./getMonthlyAvailability.dto";

export class BookingMapper{
    static toCreateBookingRequestDTO(input : any, userId : string) : CreateBookingRequestDTO {
        return {
            userId : userId,
            serviceId : input.serviceId,
            startDate : input.startDate,
            endDate : input.endDate
        }
    }
    static toGetUserBookingRequestDTO(input : any) : GetUserBookingRequestDTO {
        return {
            userId : input.userId,
            page : input.page ?? 1,
            options : {
                limit : input.limit ?? 10,
                skip : input.skip ?? 0,
                sort : input.sort ?? { createdAt : -1 }
            }
        }
    }
    static toGetUserBookingResponseDTO(bookings : (IBooking & { serviceId: Partial<IService> })[]) : GetUserBookingResponseDTO[] {
        const response : GetUserBookingResponseDTO[] = bookings.map((booking)=>{
            const service = booking.serviceId as { title : string, description : string, thumbnail : string | null };
            return {
                serviceDetails : service,
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
    static toCancelBookingRequestDTO(input : any, userId : string) : CancelBookingRequestDTO {
        return {
            bookingId : input.bookingId,
            userId : userId
        }
    }
    static toCheckAvailabilityRequestDTO(input : any) : CheckAvailabilityRequestDTO {
        return {
            serviceId : input.serviceId,
            startDate : input.startDate,
            endDate : input.endDate
        }
    }
    static toMonthlyAvailabilityRequestDTO(input : any, serviceId : string) : GetMonthlyAvailabilityDTO {
        return {
            serviceId,
            month : input.month,
            year : input.year
        }
    }
}