import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { LikeDocument, LikeModel } from "../domain/like.entity";
import { LikeStatus } from "../../core/consts/like-statuses";



@injectable()
export class LikesQueryRepository {

  async countLikes(
    commentId: string,
  ): Promise<{ likesCount: number; dislikesCount: number }> {
    const commentObjectId = new mongoose.Types.ObjectId(commentId);

    const likesCount = await LikeModel.countDocuments({
      commentId: commentObjectId,
      status: LikeStatus.Like,
    });

    const dislikesCount = await LikeModel.countDocuments({
      commentId: commentObjectId,
      status: LikeStatus.Dislike,
    });

    return { likesCount, dislikesCount };
  }

  async getUserLike(
    params: { commentId: string; userId: string }
  ): Promise<LikeDocument | null> {

    return LikeModel.findOne(
      {
        commentId: new mongoose.Types.ObjectId(params.commentId),
        userId: new mongoose.Types.ObjectId(params.userId),
      }
    )
  }
}