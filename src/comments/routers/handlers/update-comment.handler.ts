import { Request, Response } from 'express';

import { CommentInputDto } from "../../application/dtos/comment-input.dto";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentsService } from "../../application/comments.service";
import { HttpStatus } from "../../../core/consts/http-statuses";



export async function updateCommentHandler(
  req: Request<{ id: string }, void, CommentInputDto>,
  res: Response<void>,
) {
  try {
    const userId = req.user!.userId;
    const commentId = req.params.id;
    await commentsService.update(commentId, userId, req.body);
    res.sendStatus(HttpStatus.NoContent)
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}