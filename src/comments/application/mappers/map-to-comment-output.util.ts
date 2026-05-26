import { WithId } from "mongodb";
import { CommentViewModel } from "../output/comment-view-model";
import { IComment } from "../../repositories/models/comments.model";



export function mapToCommentOutput(comment: WithId<IComment>): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt.toISOString(),
  }
}



