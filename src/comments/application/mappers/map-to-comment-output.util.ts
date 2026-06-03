import { WithId } from "mongodb";
import { CommentViewModel } from "../output/comment-view-model";
import { IComment } from "../../repositories/models/comments.model";
import { LikeStatus } from "../../../core/consts/like-statuses";



export function mapToCommentOutput(comment: WithId<IComment>, myStatus: LikeStatus): CommentViewModel {
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



