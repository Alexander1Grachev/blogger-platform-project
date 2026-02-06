import { CommentViewModel } from "./comment-view-model";



export type CommentListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModel[];
}