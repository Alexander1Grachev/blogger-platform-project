import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { LikeDocument, LikeModel, LikeTargetType } from "../domain/like.entity";
import { LikeStatus } from "../../core/consts/like-statuses";
import { NewestLike } from "../domain/like-info";

type LikeAggregateResult = {
  _id: mongoose.Types.ObjectId;
  likes: {
    addedAt: Date;
    userId: mongoose.Types.ObjectId;
    login: string;
  }[];
}


@injectable()
export class LikesQueryRepository {

  async countLikes(
    params: { targetId: string; targetType: LikeTargetType; },
  ): Promise<{ likesCount: number; dislikesCount: number }> {
    const targetObjectId = new mongoose.Types.ObjectId(params.targetId);

    const likesCount = await LikeModel.countDocuments({
      targetId: new mongoose.Types.ObjectId(params.targetId),
      targetType: params.targetType,
      status: LikeStatus.Like,
    });

    const dislikesCount = await LikeModel.countDocuments({
      targetId: new mongoose.Types.ObjectId(params.targetId),
      targetType: params.targetType,
      status: LikeStatus.Dislike,
    });

    return { likesCount, dislikesCount };
  }

  async getUserLike(
    params: { targetId: string; targetType: LikeTargetType; userId: string }
  ): Promise<LikeDocument | null> {

    return LikeModel.findOne(
      {
        targetId: new mongoose.Types.ObjectId(params.targetId),
        targetType: params.targetType,
        userId: new mongoose.Types.ObjectId(params.userId),
      }
    )
  }

  async getNewestLikes(
    params: {
      targetId: string;
      targetType: LikeTargetType;
    }
  ): Promise<NewestLike[]> {

    const likes = LikeModel.find({
      targetId: new mongoose.Types.ObjectId(params.targetId),
      targetType: params.targetType,
      status: LikeStatus.Like,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return (await likes).map(like => ({
      addedAt: like.createdAt,
      userId: like.userId.toString(),
      login: like.login,
    }))
  }

  async getListNewestLikes(
    params: {
      targetId: mongoose.Types.ObjectId[];
      targetType: LikeTargetType;
    }
  ): Promise<Map<string, NewestLike[]>> {

    const likes = await LikeModel.aggregate<LikeAggregateResult>([
      {
        $match: {
          targetId: { $in: params.targetId },
          targetType: params.targetType,
          status: LikeStatus.Like,
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$targetId',
          likes: { $push: { addedAt: '$createdAt', userId: '$userId', login: '$login', } }
        }
      }, {
        $project: {
          likes: { $slice: ['$likes', 3] }
        }
      }
    ]);

    const result = new Map<string, NewestLike[]>();

    for (const group of likes) {
      const newestLikes: NewestLike[] = group.likes.map((like) => ({
        addedAt: like.addedAt,
        userId: like.userId.toString(),
        login: like.login,
      }));

      result.set(group._id.toString(), newestLikes);
    }

    return result;
  }

  async getListUsersLikes(
    params: {
      targetId: mongoose.Types.ObjectId[];
      targetType: LikeTargetType;
      userId: string
    }
  ): Promise<Map<string, LikeStatus>> {

    const userLikes = await LikeModel.find({
      targetId: { $in: params.targetId },
      targetType: params.targetType,
      userId: new mongoose.Types.ObjectId(params.userId)
    })

    const result = new Map<string, LikeStatus>();

    for (const like of userLikes) {
      result.set(
        like.targetId.toString(),
        like.status,
      )}
        return result;
  }

}