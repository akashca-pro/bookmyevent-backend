import { CancelBookingRequestDTO } from "./cancelBooking.dto";
import { CheckAvailabilityRequestDTO } from "./checkAvailability.dto";
import { CreateBookingRequestDTO } from "./createBooking.dto";
import { GetUserBookingRequestDTO } from "./getUserBookings.dto";

export class BookingMapper{
    static toCreateBookingRequestDTO(input : any) : CreateBookingRequestDTO {
        return {
            userId : input.userId,
            serviceId : input.serviceId,
            startDate : input.startDate,
            endDate : input.endDate
        }
    }
    static toGetUserBookingRequestDTO(input : any) : GetUserBookingRequestDTO {
        return {
            userId : input.userId,
            page : input.page,
            options : input.options
        }
    }
    static toCancelBookingRequestDTO(input : any) : CancelBookingRequestDTO {
        return {
            bookingId : input.bookingId,
            userId : input.userId
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