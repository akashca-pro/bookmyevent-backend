import { IBooking } from "@/db/interfaces/booking.interface";
import { CancelBookingRequestDTO } from "@/dtos/booking/cancelBooking.dto";
import { CreateBookingRequestDTO } from "@/dtos/booking/createBooking.dto";
import { GetServiceBookingsRequestDTO } from "@/dtos/booking/getServiceBookings.dto";
import { GetUserBookingRequestDTO } from "@/dtos/booking/getUserBookings.dto";
import { PaginationDTO } from "@/dtos/Pagination.dto";
import { ResponseDTO } from "@/dtos/Response.dto";

export interface IBookingService {
    createBooking(
        req : CreateBookingRequestDTO
    ): Promise<ResponseDTO<null>>;

    // Get single booking
    getBookingById(
        id: string
    ): Promise<ResponseDTO<IBooking | null>>;

    // USER: Get all personal bookings
    getUserBookings(
        req : GetUserBookingRequestDTO
    ) : Promise<PaginationDTO<IBooking>>;

    // ADMIN: Get all bookings for service provider’s service
    getServiceBookings(
        req : GetServiceBookingsRequestDTO
    ) : Promise<PaginationDTO<IBooking>>

    cancelBooking(
        req : CancelBookingRequestDTO
    ): Promise<ResponseDTO<null>>;

    // Check if booking can be made
    checkAvailability(
        serviceId: string,
        startDate: Date,
        endDate: Date
    ): Promise<ResponseDTO<null>>;
}