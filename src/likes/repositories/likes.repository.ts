import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { LikeDocument, LikeModel, LikeTargetType } from "../domain/like.entity";
import { LikeStatus } from "../../core/consts/like-statuses";
import { CommentModel } from "../../comments/domain/comment.entity";



@injectable()
export class LikesRepository {

  async deleteLike(params: { targetId: string; targetType: LikeTargetType; userId: string }): Promise<void> {
    await LikeModel.deleteOne(
      {
        targetId: new mongoose.Types.ObjectId(params.targetId),
        targetType: params.targetType,
        userId: new mongoose.Types.ObjectId(params.userId)
      }
    )
  }

  async save(newLike: LikeDocument): Promise<void> {
    await newLike.save();
  }
}