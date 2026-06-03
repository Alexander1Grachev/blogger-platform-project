import { Request, Response } from 'express';

import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { injectable, inject } from "inversify";
import { LikeStatusInputDto } from '../../../core/types/like-status-input.dto';
import { LikesService } from '../../../infrastructure/likes/likes.service';


@injectable()
export class UpdateCommentLikeStatusController {
  constructor(
    @inject(LikesService) private readonly likesService: LikesService,
  ) { };
  handle = async (
    req: Request<{ id: string }, void, LikeStatusInputDto>,
    res: Response<void>,
  ) => {
    try {
      const userId = req.user?.userId ?? null;
      const commentId = req.params.id;
      await this.likesService.updateLikeStatus(commentId, userId, req.body.likeStatus);
      res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}

