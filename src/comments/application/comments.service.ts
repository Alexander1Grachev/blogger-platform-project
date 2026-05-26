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


@injectable()
export class CommentsService {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(PostsService) private readonly postsService: PostsService,
    @inject(PostsQueryRepository) private readonly postsQueryRepository: PostsQueryRepository,
    @inject(CommentsRepository) private readonly commentsRepository: CommentsRepository,
    @inject(CommentsQueryRepository) private readonly commentsQueryRepository: CommentsQueryRepository,
  ) { };

  async findById(id: string): Promise<WithId<IComment>> {
    return this.commentsQueryRepository.findByIdOrFail(id);
  }
  async findManyPostComments(
    postId: string,
    queryDto: CommentQueryInput
  ): Promise<{ items: WithId<IComment>[]; totalCount: number }> {
    await this.postsService.findById(postId);

    return this.commentsQueryRepository.findMany(postId, queryDto);
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
    newComment.createdAt = new Date()

    return this.commentsRepository.create(newComment)
  }
}
