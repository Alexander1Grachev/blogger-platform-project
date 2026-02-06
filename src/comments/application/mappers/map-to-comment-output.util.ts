import { WithId } from "mongodb";
import { CommentViewModel } from "../output/comment-view-model";
import { Comment } from "../../domain/comments";



export function mapToCommentOutput(comment: WithId<Comment>): CommentViewModel {
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



