import { injectable, inject } from "inversify";
import { CommentsQueryRepository } from "../../comments/repositories/comments.query.repository";
import { LikeStatus } from "../../core/consts/like-statuses";
import { LikesQueryRepository } from "../repositories/likes.query.repository";
import { LikesRepository } from "../repositories/likes.repository";
import { CommentsRepository } from "../../comments/repositories/comments.repository";
import { LikeModel } from "../domain/like.entity";



@injectable()

export class LikesService {
  constructor(
    @inject(CommentsRepository) private readonly commentsRepository: CommentsRepository,
    @inject(CommentsQueryRepository) private readonly commentsQueryRepository: CommentsQueryRepository,
    @inject(LikesRepository) private readonly likesRepository: LikesRepository,
    @inject(LikesQueryRepository) private readonly likesQueryRepository: LikesQueryRepository,


  ) { };
  async updateLikeStatus(
    commentId: string,
    userId: string | null,
    statusDto: LikeStatus
  ): Promise<void> {
    if (!userId) return;

    const comment = await this.commentsQueryRepository.findByIdOrFail(commentId);
    const like = await this.likesQueryRepository.getUserLike({ commentId, userId });

    if (statusDto === LikeStatus.None) {
      await this.likesRepository.deleteLike(userId, commentId);
    } else if (like) {
      like.updateLikeStatus(statusDto);
      await this.likesRepository.save(like);
    } else {
      const newLike = LikeModel.createLike({
        commentId,
        userId,
        status: statusDto
      });
      await this.likesRepository.save(newLike);
      console.log('saved like:', newLike); // ?
    }

    const { likesCount, dislikesCount } = await this.likesQueryRepository.countLikes(commentId);
    console.log('counts:', { likesCount, dislikesCount }); // 
    comment.updateLikeInfo(likesCount, dislikesCount);
    console.log('comment.likesInfo after update:', comment.likesInfo); // 
    await this.commentsRepository.save(comment);
  }
}