import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { LikeStatus } from "../../core/consts/like-statuses";
import { ObjectId } from "mongodb";


export interface ILikeModel {
  userId: ObjectId;
  commentId: ObjectId;
  status: LikeStatus.Like | LikeStatus.Dislike;
}

export type LikeDocument = HydratedDocument<ILikeModel>
type LikeModel = Model<ILikeModel>;

export const LikeSchema = new mongoose.Schema<ILikeModel, LikeModel>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },// Не ObjectId ! 
  commentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['Like', 'Dislike'], required: true },
})

export const LikeModel: LikeModel = model<ILikeModel, LikeModel>('Like', LikeSchema)