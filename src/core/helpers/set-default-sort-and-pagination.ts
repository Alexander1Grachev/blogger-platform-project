import { paginationAndSortingDefault } from '../consts/pagination-and-sorting.default';
import { PaginationAndSorting } from '../types/pagination-and-sorting';

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}
