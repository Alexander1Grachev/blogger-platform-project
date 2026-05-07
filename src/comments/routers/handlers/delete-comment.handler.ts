import { Request, Response } from 'express';

import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { CommentsService } from "../../application/comments.service";


export class DeleteCommentController {
  constructor(private readonly commentsService: CommentsService) { };
  handle = async (
    req: Request<{ id: string }>,
    res: Response,
  ) => {
    try {
      const userId = req.user!.userId
      const commentId = req.params.id;
      await this.commentsService.delete(commentId, userId);
      res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}