import { WithId } from "mongodb";
import { CommentsQueryRepository } from "../repositories/comments.query.repository";
import { CommentsRepository } from "../repositories/comments.repository";

import { CommentInputDto } from "./dtos/comment-input.dto";
import { PostsService } from "../../posts/application/posts.service";
import { AuthService } from "../../auth/application/auth-user.service";
import { CommentQueryInput } from "../routers/input/comment-query.input";
import { ForbiddenError } from "../../core/errors/forbidden.error";
import { injectable, inject } from "inversify";
import { PostsQueryRepository } from "../../posts/reposytories/posts.query.repository";
import { LikeStatus } from "../../core/consts/like-statuses";
import { CommentDocument, CommentModel } from "../domain/comment.entity";
import { LikesQueryRepository } from "../../likes/repositories/likes.query.repository";
import { LikeTargetType } from "../../likes/domain/like.entity";


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

  async findById(
    commentId: string,
    userId: string | null
  ): Promise<{ comment: CommentDocument, myStatus: LikeStatus }> {
    
    const like = userId
      ? await this.likesQueryRepository.getUserLike({
        targetId: commentId,
        targetType: LikeTargetType.Comment
        , userId
      })
      : null;
    const myStatus = like?.status ?? LikeStatus.None;

    const comment = await this.commentsQueryRepository.findByIdOrFail(commentId);
    return { comment, myStatus }
  }

  async findManyPostComments(
    postId: string,
    queryDto: CommentQueryInput,
    userId: string | null,
  ): Promise<{ items: { comment: CommentDocument, myStatus: LikeStatus }[], totalCount: number }> {

    await this.postsQueryRepository.findByIdOrFail(postId);
    const { items, totalCount } = await this.commentsQueryRepository.findMany(postId, queryDto);

    const itemsWithStatus = await Promise.all(items.map(async (comment) => {
      const like = userId
        ? await this.likesQueryRepository.getUserLike({
          targetId: comment._id.toString(),
          targetType: LikeTargetType.Comment,
          userId
        })
        : null;
      const myStatus = like?.status ?? LikeStatus.None;
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
    comment.updateComment(dto);
    await this.commentsRepository.save(comment);
  }

  async create(postId: string, userId: string, dto: CommentInputDto): Promise<string> {
    await this.postsQueryRepository.findByIdOrFail(postId);

    const { userId: meUserId, login } = await this.authService.getMeView(userId);

    const newComment = CommentModel.createComment(
      postId,
      { userId: meUserId, login },
      dto
    );

    return this.commentsRepository.save(newComment);
  }
}
