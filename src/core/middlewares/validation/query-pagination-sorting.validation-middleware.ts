import { query } from 'express-validator';
import { SortDirection } from "../../consts/sort-direction"
import {
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DEFAULT_SORT_DIRECTION,
} from '../../consts/pagination-and-sorting.default';



export function paginationAndSortingValidation<T extends string>(
    sortFieldsEnum: Record<string, T>
) {
    const allowedSortFields = Object.values(sortFieldsEnum)

    return [
        query('pageNumber')
            .default(DEFAULT_PAGE_NUMBER)
            .isInt({ min: 1 })
            .withMessage('Page number must be a positive integer')
            .toInt(),

        query('pageSize')
            .default(DEFAULT_PAGE_SIZE)
            .isInt({ min: 1, max: 100 })
            .withMessage('Page size must be between 1 and 100')
            .toInt(),

        query('sortBy')
            .default(Object.values(sortFieldsEnum)[0])
            .isIn(allowedSortFields)
            .withMessage(
                `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`,
            ),

        query('sortDirection')
            .default(DEFAULT_SORT_DIRECTION)
            .isIn(Object.values(SortDirection))
            .withMessage(
                `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
            ),
    ]
}