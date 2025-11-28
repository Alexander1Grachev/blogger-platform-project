import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { BlogSortField } from '../../../core/consts/blog-sort-field';

export type BlogQueryInput = PaginationAndSorting<BlogSortField> &
  Partial<{
    searchBlogNameTerm: string;
  }>;
