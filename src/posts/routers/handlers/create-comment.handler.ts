import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { CommentInputDto } from '../../../comments/application/dtos/comment-input.dto';
import { CommentsService } from '../../../comments/application/comments.service';
import { mapToCommentOutput } from '../../../comments/application/mappers/map-to-comment-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";


@injectable()
export class CreateCommentController {
  constructor(@inject(CommentsService) private readonly commentsService: CommentsService) { };
  handle = async (
    req: Request<{ id: string }, void, CommentInputDto>,
    res: Response,
  ) => {
    try {
      const postId = req.params.id;
      const userId = req.user!.userId
      if (!userId) {
        return res.sendStatus(HttpStatus.Unauthorized);
      };
      const commentId = await this.commentsService.create(postId, userId, req.body);
      const createdComment = await this.commentsService.findById(commentId);
      const commentOutput = mapToCommentOutput(createdComment);
      return res.status(HttpStatus.Created).send(commentOutput);
    } catch (e: unknown) {
      return errorsHandler(e, res);
    }
  }
}