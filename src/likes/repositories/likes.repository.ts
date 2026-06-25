import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { LikeDocument, LikeModel } from "../domain/like.entity";
import { LikeStatus } from "../../core/consts/like-statuses";
import { CommentModel } from "../../comments/domain/comment.entity";



@injectable()
export class LikesRepository {

  async deleteLike(userId: string, commentId: string): Promise<void> {
    await LikeModel.deleteOne(
      {
        commentId: new mongoose.Types.ObjectId(commentId),
        userId: new mongoose.Types.ObjectId(userId)
      }
    )
  }

  async save(newLike: LikeDocument): Promise<void> {
    await newLike.save();
  }
}