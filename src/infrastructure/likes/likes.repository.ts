import { injectable } from "inversify";
import { Types } from "mongoose";
import { LikeModel } from "./likes.model";
import { LikeStatus } from "../../core/consts/like-statuses";
import { CommentModel } from "../../comments/repositories/models/comments.model";



@injectable()
export class LikesRepository {

async deleteLike(userId: string, commentId: string):Promise<void>{
  await LikeModel.deleteOne(
    {
       commentId: new Types.ObjectId(commentId),
        userId: new Types.ObjectId(userId)
    }
  )
}

  async updateLikeStatus(userId: string, commentId: string, statusDto: LikeStatus): Promise<void> {
    await LikeModel.updateOne(
      {
        commentId: new Types.ObjectId(commentId),
        userId: new Types.ObjectId(userId)
      },
      {
        $set: { status: statusDto }
      },
      { upsert: true }
    );
  }

  async updateLikeInfo(
    commentId: string,
    likesCount: number,
    dislikesCount: number
  ): Promise<void> {
    await CommentModel.updateOne(
      { _id: new Types.ObjectId(commentId) },
      {
        $set: {
          'likesInfo.likesCount': likesCount,
          'likesInfo.dislikesCount': dislikesCount
        }
      })
  }
}