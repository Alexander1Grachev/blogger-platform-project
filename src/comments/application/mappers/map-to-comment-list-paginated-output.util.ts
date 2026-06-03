import { WithId } from "mongodb";
import { IComment } from "../../repositories/models/comments.model";
import { CommentListPaginatedOutput } from "../output/comment-list-paginated.output";
import { CommentViewModel } from "../output/comment-view-model";
import { LikeStatus } from "../../../core/consts/like-statuses";

export function mapToCommentListPaginatedOutput(
    items: { comment: WithId<IComment>, myStatus: LikeStatus }[],
    meta: { pageNumber: number, pageSize: number, totalCount: number },
): CommentListPaginatedOutput {
    return {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: items.map(({ comment, myStatus }): CommentViewModel => ({
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus,
            },
            createdAt: comment.createdAt.toISOString(),
        }))
    }
}