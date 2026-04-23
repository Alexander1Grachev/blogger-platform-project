import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { CommentInputDto } from '../../../comments/application/dtos/comment-input.dto';
import { commentsService } from '../../../comments/application/comments.service';
import { mapToCommentOutput } from '../../../comments/application/mappers/map-to-comment-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';


export async function createCommentHandler(
  req: Request<{ id: string }, void, CommentInputDto>,
  res: Response,
) {
  try {
    const postId = req.params.id;
    const userId = req.user!.userId
    if (!userId) {
      return res.sendStatus(HttpStatus.Unauthorized);
    };
    const commentId = await commentsService.create(postId, userId, req.body);
    const createdComment = await commentsService.findByIdOrFail(commentId);
    const commentOutput = mapToCommentOutput(createdComment);
    return res.status(HttpStatus.Created).send(commentOutput);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}