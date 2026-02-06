import { PostViewModel } from "./post-view-model"



export type PostListPaginatedOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewModel[]
}
