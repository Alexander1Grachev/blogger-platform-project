import mongoose, { HydratedDocument, model, Model } from "mongoose";

export type CommentatorInfoView = {
  userId: string;
  userLogin: string;
};


export interface IComment {
  content: string;
  commentatorInfo: CommentatorInfoView;
  postId: string; // для фильтрации коментариев 
  createdAt: Date;
};

export type CommentDocument = HydratedDocument<IComment>;
type CommentModel = Model<IComment>;


export const CommentSchema = new mongoose.Schema<IComment, CommentModel>({
  content: { type: String, required: true, trim: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  postId: { type: String, required: true },
  createdAt: { type: Date, required: true },
})


export const CommentModel: CommentModel = model<IComment, CommentModel>('Comment', CommentSchema)