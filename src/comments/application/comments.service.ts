import { WithId } from "mongodb";
import { CommentsRepository } from "../repositories/comments.repository"
import { Comment } from "../repositories/models/comments.model";
import { CommentInputDto } from "./dtos/comment-input.dto";
import { PostsService } from "../../posts/application/posts.service";
import { AuthService } from "../../auth/application/auth-user.service";
import { CommentQueryInput } from "../routers/input/comment-query.input";
import { ForbiddenError } from "../../core/errors/forbidden.error";

export class CommentsService {
  constructor(
    private readonly authService: AuthService,
    private readonly postsService: PostsService,
    private readonly commentsRepository: CommentsRepository,

  ) { };

  async findByIdOrFail(id: string): Promise<WithId<Comment>> {
    return this.commentsRepository.findByIdOrFail(id);
  }
  async findManyPostComments(
    postId: string,
    queryDto: CommentQueryInput
  ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
    await this.postsService.findByIdOrFail(postId);

    return this.commentsRepository.findMany(postId, queryDto);
  }

  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findByIdOrFail(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenError('Not your comment')
    }
    return this.commentsRepository.delete(commentId);
  }
  async update(commentId: string, userId: string, dto: CommentInputDto): Promise<void> {
    const comment = await this.commentsRepository.findByIdOrFail(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenError('Not your comment')
    }
    return this.commentsRepository.update(commentId, dto)
  }
  async create(postId: string, userId: string, dto: CommentInputDto): Promise<string> {
    await this.postsService.findByIdOrFail(postId);
    const me = await this.authService.getMeView(userId);
    const newComment: Comment = {
      content: dto.content,
      commentatorInfo: {
        userId: me.userId,
        userLogin: me.login,
      },
      postId: postId,
      createdAt: new Date(),
    };
    return this.commentsRepository.create(newComment)

  }
}
