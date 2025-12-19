import { IBooking } from "@/db/interfaces/booking.interface";
import { CancelBookingRequestDTO } from "@/dtos/booking/cancelBooking.dto";
import { CheckAvailabilityRequestDTO } from "@/dtos/booking/checkAvailability.dto";
import { GetMonthlyAvailabilityDTO } from "@/dtos/booking/getMonthlyAvailability.dto";
import { GetUserBookingRequestDTO, GetUserBookingResponseDTO } from "@/dtos/booking/getUserBookings.dto";
import { ReserveBookingRequestDTO, ReserveBookingResponseDTO } from "@/dtos/booking/reserveBooking.dto";
import { PaginationDTO } from "@/dtos/Pagination.dto";
import { ResponseDTO } from "@/dtos/Response.dto";

export interface IBookingService {

    reserveBooking(
        req : ReserveBookingRequestDTO
    ) : Promise<ResponseDTO<ReserveBookingResponseDTO | null>>;

    confirmBooking(
        bookingId : string
    ) : Promise<ResponseDTO<null>>;

    // Get single booking
    getBookingById(
        id: string
    ): Promise<ResponseDTO<IBooking | null>>;

    // USER: Get all personal bookings
    getUserBookings(
        req : GetUserBookingRequestDTO
    ) : Promise<PaginationDTO<GetUserBookingResponseDTO>>;

    cancelBooking(
        req : CancelBookingRequestDTO
    ): Promise<ResponseDTO<null>>;

    // Check if booking can be made
    checkAvailability(
        req : CheckAvailabilityRequestDTO
    ): Promise<ResponseDTO<null>>;

    getMonthlyAvailability(
        req : GetMonthlyAvailabilityDTO
    ): Promise<ResponseDTO<Record<string, boolean> | null>>;
}