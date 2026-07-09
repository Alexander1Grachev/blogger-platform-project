import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";
import { LikeStatus } from "../../core/consts/like-statuses";

export enum LikeTargetType {
  Comment = 'Comment',
  Post = 'Post',
}
type CreateLikeDto = {
  userId: string;
  targetId: string;
  targetType: LikeTargetType;
  status: LikeStatus.Like | LikeStatus.Dislike;
  login: string; //  денормализация!

}

export class LikeEntity {
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(
    public userId: mongoose.Types.ObjectId,
    public targetId: mongoose.Types.ObjectId,
    public targetType: LikeTargetType,
    public status: LikeStatus.Like | LikeStatus.Dislike,
    public login: string
  ) { }

  // Instance methods
  updateLikeStatus(status: LikeStatus.Like | LikeStatus.Dislike): void {
    this.status = status;
  }

  // Statics
  static createLike(dto: CreateLikeDto): LikeDocument {
    return new LikeModel({
      userId: new mongoose.Types.ObjectId(dto.userId),
      targetId: new mongoose.Types.ObjectId(dto.targetId),
      targetType: dto.targetType,
      status: dto.status,
      login: dto.login,
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
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: LikeTargetType, required: true },
  status: { type: String, enum: ['Like', 'Dislike'], required: true },
  login: { type: String, required: true },
}, { timestamps: true });

// составной индекс один лайк на юзера на цель
LikeSchema.index({ targetId: 1, targetType: 1, userId: 1 }, { unique: true });

LikeSchema.loadClass(LikeEntity);
export const LikeModel = model<LikeEntity, LikeModel>('Like', LikeSchema);