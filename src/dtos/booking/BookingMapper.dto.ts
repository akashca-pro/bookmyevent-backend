import { CancelBookingRequestDTO } from "./cancelBooking.dto";
import { CheckAvailabilityRequestDTO } from "./checkAvailability.dto";
import { CreateBookingRequestDTO } from "./createBooking.dto";
import { GetUserBookingRequestDTO } from "./getUserBookings.dto";

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
}