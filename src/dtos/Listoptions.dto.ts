export interface ListOptions {
    limit: number;
    skip: number;
    sort?: Record<string, 1 | -1>;
}