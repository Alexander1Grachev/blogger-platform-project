import { LikeStatus } from "../../../core/consts/like-statuses";
import { CommentatorInfoView } from "../../domain/comment.entity";

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoView;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
  createdAt: string;
}