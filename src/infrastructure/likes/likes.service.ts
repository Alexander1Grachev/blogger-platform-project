import { injectable, inject } from "inversify";
import { CommentsQueryRepository } from "../../comments/repositories/comments.query.repository";
import { LikeStatus } from "../../core/consts/like-statuses";
import { LikesRepository } from "./likes.repository";
import { LikesQueryRepository } from "./likes.query.repository";


@injectable()

export class LikesService {
    constructor(
        @inject(CommentsQueryRepository) private readonly commentsQueryRepository: CommentsQueryRepository,
        @inject(LikesRepository) private readonly likesRepository: LikesRepository,
        @inject(LikesQueryRepository) private readonly likesQueryRepository: LikesQueryRepository,


    ) { };
 async updateLikeStatus(commentId: string, userId: string | null, statusDto: LikeStatus): Promise<void> {
  if (!userId) return;
  await this.commentsQueryRepository.findByIdOrFail(commentId);

  if (statusDto === LikeStatus.None) {
    await this.likesRepository.deleteLike(userId, commentId);
  } else {
    await this.likesRepository.updateLikeStatus(userId, commentId, statusDto);
  }

  const { likesCount, dislikesCount } = await this.likesQueryRepository.countLikes(commentId);
  await this.likesRepository.updateLikeInfo(commentId, likesCount, dislikesCount);
}
}