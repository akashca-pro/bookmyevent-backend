// repos/interfaces/category.repo.interface.ts
import { ICategory } from "@/db/interfaces/category.interface";
import { ListOptions } from "@/dtos/Listoptions.dto";

export interface ICategoryRepo {
    // CRUD
    createCategory(data: Partial<ICategory>): Promise<ICategory | null>;
    getCategoryById(id: string): Promise<ICategory | null>;
    getCategoryBySlug(slug: string): Promise<ICategory | null>;
    updateCategory(id: string, data: Partial<ICategory>): Promise<boolean>;
    toggleArchiveStatus(id: string): Promise<boolean>;
    deleteCategory(id : string) : Promise<boolean>;

    // Listing
    getCategories(options: ListOptions): Promise<ICategory[]>;
    getActiveCategories(): Promise<ICategory[]>;

    // Utilities
    existsBySlug(slug: string): Promise<boolean>;
    countCategories(): Promise<number>;
}
