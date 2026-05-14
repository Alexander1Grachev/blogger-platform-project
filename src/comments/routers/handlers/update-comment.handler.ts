import { Request, Response } from 'express';

import { CommentInputDto } from "../../application/dtos/comment-input.dto";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { CommentsService } from "../../application/comments.service";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { injectable, inject } from "inversify";


@injectable()
export class UpdateCommentController {
  constructor(@inject(CommentsService) private readonly commentsService: CommentsService) { };
  handle = async (
    req: Request<{ id: string }, void, CommentInputDto>,
    res: Response<void>,
  ) => {
    try {
      const userId = req.user!.userId;
      const commentId = req.params.id;
      await this.commentsService.update(commentId, userId, req.body);
      res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}