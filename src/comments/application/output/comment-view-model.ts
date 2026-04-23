import { CommentatorInfoView } from "../../repositories/models/comments.model";

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoView;
  createdAt: string;
}