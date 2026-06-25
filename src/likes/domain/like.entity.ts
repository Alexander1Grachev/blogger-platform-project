import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";
import { LikeStatus } from "../../core/consts/like-statuses";

type CreateLikeDto = {
  userId: string;
  commentId: string;
  status: LikeStatus.Like | LikeStatus.Dislike;
}

export class LikeEntity {
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(
    public userId: mongoose.Types.ObjectId,
    public commentId: mongoose.Types.ObjectId,
    public status: LikeStatus.Like | LikeStatus.Dislike,
  ) { }

  // Instance methods
  updateLikeStatus(status: LikeStatus.Like | LikeStatus.Dislike): void {
    this.status = status;
  }

  // Statics
  static createLike(dto: CreateLikeDto): LikeDocument {
    return new LikeModel({
      userId: new mongoose.Types.ObjectId(dto.userId),
      commentId: new mongoose.Types.ObjectId(dto.commentId),
      status: dto.status,
    }) as LikeDocument;
  }
}

interface LikeMethods {
  updateLikeStatus(status: LikeStatus.Like | LikeStatus.Dislike): void;
}

interface LikeStatics {
  createLike(dto: CreateLikeDto): LikeDocument;
}

// Модель без & typeof LikeEntity
export type LikeModel = Model<LikeEntity, {}, LikeMethods> & LikeStatics;
export type LikeDocument = HydratedDocument<LikeEntity, LikeMethods>;

export const LikeSchema = new mongoose.Schema<LikeEntity, LikeModel>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  commentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['Like', 'Dislike'], required: true },
}, { timestamps: true });

LikeSchema.loadClass(LikeEntity);
export const LikeModel = model<LikeEntity, LikeModel>('Like', LikeSchema);