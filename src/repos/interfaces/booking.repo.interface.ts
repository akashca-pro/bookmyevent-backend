import { IBooking } from "@/db/interfaces/booking.interface";
import { IService } from "@/db/interfaces/service.interface";
import { IUser } from "@/db/interfaces/user.interface";
import { ListOptions } from "@/dtos/Listoptions.dto";

export interface IBookingRepo {
    createBooking(data: Partial<IBooking>): Promise<IBooking | null>;
    getBookingById(id: string): Promise<IBooking | null>;

    // User bookings
    getBookingsByUser(
        userId: string,
        options: ListOptions
    ): Promise<(IBooking & { serviceId : Partial<IService> })[]>;

    countBookingsByUser(userId: string): Promise<number>;
    countBookingsByService(serviceId: string): Promise<number>;

    // All bookings for a service (admin dashboard)
    getBookingsByService(
        serviceId: string,
        options?: ListOptions,
    ): Promise<(IBooking & { userId : Partial<IUser> })[]>;

    // Booking conflict detection.
    getConflictingBookings(
        serviceId: string,
        startDate: Date,
        endDate: Date
    ): Promise<IBooking[]>;

    getBookedServiceIdsInRange(
        startDate: Date,
        endDate: Date
    ): Promise<string[]>;

    cancelBooking(id: string): Promise<boolean>;

    getMonthlyBookingMap(
        serviceId: string,
        month: number,
        year: number
    ): Promise<Record<string, boolean>>;

}