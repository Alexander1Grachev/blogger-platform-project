import { Request, Response } from 'express';

import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentsService } from "../../application/comments.service";



export async function deleteCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const userId = req.user!.id
    const commentId = req.params.id;
    await commentsService.delete(commentId, userId);
    res.sendStatus(HttpStatus.NoContent)
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}