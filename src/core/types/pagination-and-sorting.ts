import { SortDirection } from "../consts/sort-direction";

export type PaginationAndSorting<S> = {
    pageNumber: number;
    pageSize: number;
    sortBy: S;
    sortDirection: SortDirection;
};
