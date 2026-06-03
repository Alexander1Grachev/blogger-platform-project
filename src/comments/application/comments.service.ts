import { WithId } from "mongodb";
import { CommentsQueryRepository } from "../repositories/comments.query.repository";
import { CommentsRepository } from "../repositories/comments.repository";

import { IComment, CommentModel } from "../repositories/models/comments.model";
import { CommentInputDto } from "./dtos/comment-input.dto";
import { PostsService } from "../../posts/application/posts.service";
import { AuthService } from "../../auth/application/auth-user.service";
import { CommentQueryInput } from "../routers/input/comment-query.input";
import { ForbiddenError } from "../../core/errors/forbidden.error";
import { injectable, inject } from "inversify";
import { PostsQueryRepository } from "../../posts/reposytories/posts.query.repository";
import { LikesQueryRepository } from "../../infrastructure/likes/likes.query.repository";
import { LikeStatus } from "../../core/consts/like-statuses";


@injectable()
export class CommentsService {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(PostsService) private readonly postsService: PostsService,
    @inject(PostsQueryRepository) private readonly postsQueryRepository: PostsQueryRepository,
    @inject(CommentsRepository) private readonly commentsRepository: CommentsRepository,
    @inject(CommentsQueryRepository) private readonly commentsQueryRepository: CommentsQueryRepository,
    @inject(LikesQueryRepository) private readonly likesQueryRepository: LikesQueryRepository,

  ) { };

  async findById(commentId: string, userId: string | null): Promise<{ comment: WithId<IComment>, myStatus: LikeStatus }> {
    const myStatus = userId
      ? await this.likesQueryRepository.getUserLikeStatus(commentId, userId)
      : LikeStatus.None;

    const comment = await this.commentsQueryRepository.findByIdOrFail(commentId);
    return { comment, myStatus }
  }
  async findManyPostComments(
    postId: string,
    queryDto: CommentQueryInput,
    userId: string | null,
  ): Promise<{ items: { comment: WithId<IComment>, myStatus: LikeStatus }[], totalCount: number }> {


    await this.postsService.findById(postId);
    const { items, totalCount } = await this.commentsQueryRepository.findMany(postId, queryDto);

    const itemsWithStatus = await Promise.all(items.map(async (comment) => {
      const myStatus = userId
        ? await this.likesQueryRepository.getUserLikeStatus(comment._id.toString(), userId)
        : LikeStatus.None;
      return { comment, myStatus };
    }))


    return { items: itemsWithStatus, totalCount }
  }

  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsQueryRepository.findByIdOrFail(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenError('Not your comment')
    }
    this.commentsRepository.delete(commentId);
  }
  async update(commentId: string, userId: string, dto: CommentInputDto): Promise<void> {
    const comment = await this.commentsQueryRepository.findByIdOrFail(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenError('Not your comment')
    }
    this.commentsRepository.update(commentId, dto)
  }

  async create(postId: string, userId: string, dto: CommentInputDto): Promise<string> {
    await this.postsQueryRepository.findByIdOrFail(postId);

    const me = await this.authService.getMeView(userId);

    const newComment = new CommentModel;
    newComment.content = dto.content
    newComment.commentatorInfo = {
      userId: me.userId,
      userLogin: me.login
    }
    newComment.postId = postId
    newComment.likesInfo = {   
      likesCount: 0,
      dislikesCount: 0,
    }

    return this.commentsRepository.create(newComment)
  }
}
