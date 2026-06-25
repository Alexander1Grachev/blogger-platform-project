import { CommentViewModel } from "../output/comment-view-model";
import { LikeStatus } from "../../../core/consts/like-statuses";
import { CommentDocument } from "../../domain/comment.entity";



export function mapToCommentOutput(comment: CommentDocument, myStatus: LikeStatus): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: myStatus
    },
    createdAt: comment.createdAt.toISOString(),
  }
}



