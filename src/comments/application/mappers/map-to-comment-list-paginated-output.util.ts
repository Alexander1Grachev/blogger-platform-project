import { WithId } from "mongodb";
import { IComment } from "../../repositories/models/comments.model";
import { CommentListPaginatedOutput } from "../output/comment-list-paginated.output";
import { CommentViewModel } from "../output/comment-view-model";


export function mapToCommentListPaginatedOutput(
    comments: WithId<IComment>[],
    meta: { pageNumber: number, pageSize: number, totalCount: number },
): CommentListPaginatedOutput {
    return {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: comments.map((comment): CommentViewModel => ({
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt.toISOString(),

        }))
    }
}