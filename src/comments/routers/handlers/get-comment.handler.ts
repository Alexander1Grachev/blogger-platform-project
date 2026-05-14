import { errorsHandler } from "../../../core/errors/errors.handler";
import { Request, Response } from 'express';
import { mapToCommentOutput } from "../../application/mappers/map-to-comment-output.util";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { CommentsService } from "../../application/comments.service";
import { injectable, inject } from "inversify";


@injectable()
export class GetCommentController {
  constructor(@inject(CommentsService) private readonly commentsService: CommentsService) { };

  handle = async (
    req: Request<{ id: string }>,
    res: Response,
  ) => {
    try {
      const commentId = req.params.id;
      const comment = await this.commentsService.findByIdOrFail(commentId)
      const commentOutput = mapToCommentOutput(comment)
      res.status(HttpStatus.Ok).send(commentOutput)
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}