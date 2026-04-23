import { UserViewModel } from "./user-view-model"

export type UserListPaginatedOutput = {

    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}