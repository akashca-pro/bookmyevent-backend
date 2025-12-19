import { IBooking } from "@/db/interfaces/booking.interface";
import { CancelBookingRequestDTO } from "./cancelBooking.dto";
import { CheckAvailabilityRequestDTO } from "./checkAvailability.dto";
import { ReserveBookingRequestDTO, ReserveBookingResponseDTO } from "./reserveBooking.dto";
import { GetUserBookingRequestDTO, GetUserBookingResponseDTO } from "./getUserBookings.dto";
import { IService } from "@/db/interfaces/service.interface";
import { GetMonthlyAvailabilityDTO } from "./getMonthlyAvailability.dto";
import { Types } from "mongoose";
import { BOOKING_STATUS } from "@/const/bookingStatus.const";

export class BookingMapper{
    static toReserveBookingRequestDTO(input : any, userId : string, serviceId : string) : ReserveBookingRequestDTO {
        return {
            userId : new Types.ObjectId(userId),
            serviceId : new Types.ObjectId(serviceId),
            startDate : input.startDate,
            endDate : input.endDate
        }
    }
    static toReserveBookingResponseDTO(booking : IBooking) : ReserveBookingResponseDTO {
        return {
            id : booking._id!,
            startDate : booking.startDate,
            endDate : booking.endDate,
            totalPrice : booking.totalPrice,
            createdAt : booking.createdAt,
            updatedAt : booking.updatedAt
        }
    }
    static toGetUserBookingRequestDTO(input : any, userId : string) : GetUserBookingRequestDTO {
        return {
            userId : userId,
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