export interface PageRequest {

    page: number;
    pageSize: number;
    oldestFirst: boolean;

}

export interface PageResponse<Data> {

    data: Data[];
    count: number;
    page: number;
    pageSize: number;
    totalPages: number;

}