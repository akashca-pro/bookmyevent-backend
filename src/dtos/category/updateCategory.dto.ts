export interface UpdateCategoryRequestDTO {
    id : string;
    data : {
        name? : string;
        slug? : string;
        description? : string;
        isArchive? : boolean;
        isActive? : boolean;
    }
}