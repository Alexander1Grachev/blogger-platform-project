import mongoose, { HydratedDocument, model, Model } from "mongoose";


export interface LikeInfoView {
  likesCount: number;
  dislikesCount: number;
}

export const likeInfoSchema = ({
  likesCount: { type: Number, required: true, default: 0 },
  dislikesCount: { type: Number, required: true, default: 0 },
})
///
export type CommentatorInfoView = {
  userId: string;
  userLogin: string;
};
export const commentatorInfoSchema = {
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
}
/////////////////////////////////////////////////

export interface IComment {
  content: string;
  commentatorInfo: CommentatorInfoView;
  postId: string; // для фильтрации коментариев 
  likesInfo: LikeInfoView;
  createdAt: Date;
  updatedAt: Date;
};

export type CommentDocument = HydratedDocument<IComment>;
type CommentModel = Model<IComment>;


export const CommentSchema = new mongoose.Schema<IComment, CommentModel>({
  content: { type: String, required: true, trim: true },
  commentatorInfo: { type: commentatorInfoSchema },
  postId: { type: String, required: true },
  likesInfo: { type: likeInfoSchema },
}, {
  timestamps: true
})


export const CommentModel: CommentModel = model<IComment, CommentModel>('Comment', CommentSchema)