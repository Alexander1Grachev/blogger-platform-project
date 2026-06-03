import { injectable } from "inversify";
import { Types } from "mongoose";
import { LikeModel } from "./likes.model";
import { LikeStatus } from "../../core/consts/like-statuses";



@injectable()
export class LikesQueryRepository {

  async countLikes(
    commentId: string,
  ): Promise<{ likesCount: number, dislikesCount: number }> {
    const likesCount = await LikeModel.countDocuments({
      commentId: new Types.ObjectId(commentId),
      status: LikeStatus.Like
    });
    const dislikesCount = await LikeModel.countDocuments({
      commentId: new Types.ObjectId(commentId),
      status: LikeStatus.Dislike
    });

    return { likesCount, dislikesCount };
  }

  async getUserLikeStatus(
    commentId: string,
    userId: string,
  ): Promise<LikeStatus> {

    const like = await LikeModel.findOne(
      {
        commentId: new Types.ObjectId(commentId),
        userId: new Types.ObjectId(userId),
      }
    )
    return like?.status ?? LikeStatus.None
  }
}