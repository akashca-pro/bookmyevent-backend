import { IService } from "@/db/interfaces/service.interface";
import { ListOptions } from "@/dtos/Listoptions.dto";

export interface ServiceFilter {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    adminId?: string;
}

export interface IServiceRepo {
    // Basic CRUD
    createService(data : Partial<IService>) : Promise<IService | null>;
    getServiceById(id : string) : Promise<IService | null>;
    updateService(id : string, data : Partial<IService>) : Promise<boolean>;
    archieveService(id : string) : Promise<boolean>;

    // Admin-level listing (services created by admin)
    getServicesByAdmin(adminId: string, options: ListOptions): Promise<IService[]>;

    // User-facing listing
    getServices(filter: ServiceFilter, options: ListOptions): Promise<IService[]>;

    // Check if a service exists.
    exists(id: string): Promise<boolean>;

    getServicesByCategory(category: string, options: ListOptions): Promise<IService[]>;
    getServicesByCity(city: string, options: ListOptions): Promise<IService[]>;

    getAvailableServices(
        bookedServiceIds : string[],
        startDate: Date,
        endDate: Date,
        filter: ServiceFilter,
        options: ListOptions
    ): Promise<IService[]>;

    countServices(filter: ServiceFilter): Promise<number>;
    countAvailableServices(
        bookedServiceIds : string[],
        startDate: Date,
        endDate: Date,
        filter: ServiceFilter
    ): Promise<number>;
}