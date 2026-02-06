import { CommentatorInfoView } from "../../domain/comments";

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoView;
  createdAt: string;
}