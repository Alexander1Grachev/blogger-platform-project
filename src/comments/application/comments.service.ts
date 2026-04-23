import { WithId } from "mongodb";
import { commentsRepository } from "../repositories/comments.repository"
import { Comment } from "../repositories/models/comments.model";
import { CommentInputDto } from "./dtos/comment-input.dto";
import { postsService } from "../../posts/application/posts.service";
import { authService } from "../../auth/application/auth-user.service";
import { CommentQueryInput } from "../routers/input/comment-query.input";
import { ForbiddenError } from "../../core/errors/forbidden.error";


export const commentsService = {
  async findByIdOrFail(id: string): Promise<WithId<Comment>> {
    return commentsRepository.findByIdOrFail(id);
  },
  async findManyPostComments(
    postId: string,
    queryDto: CommentQueryInput
  ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
    await postsService.findByIdOrFail(postId);

    return commentsRepository.findMany(postId, queryDto);
  }
  ,
  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await commentsRepository.findByIdOrFail(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenError('Not your comment')
    }
    return commentsRepository.delete(commentId);
  },
  async update(commentId: string, userId: string, dto: CommentInputDto): Promise<void> {
    const comment = await commentsRepository.findByIdOrFail(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenError('Not your comment')
    }
    return commentsRepository.update(commentId, dto)
  },
  async create(postId: string, userId: string, dto: CommentInputDto): Promise<string> {
    await postsService.findByIdOrFail(postId);
    const me = await authService.getMeView(userId);
    const newComment: Comment = {
      content: dto.content,
      commentatorInfo: {
        userId: me.userId,
        userLogin: me.login,
      },
      postId: postId,
      createdAt: new Date(),
    };
    return commentsRepository.create(newComment)

  }
}