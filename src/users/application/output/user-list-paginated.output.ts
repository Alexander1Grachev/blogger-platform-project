import { UserViewModel } from "../../application/dtos/user-view-model"

export type UserListPaginatedOutput = {

    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}