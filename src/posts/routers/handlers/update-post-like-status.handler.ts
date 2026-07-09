import { Request, Response } from 'express';

import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { injectable, inject } from "inversify";
import { LikeStatusInputDto } from '../../../core/types/like-status-input.dto';
import { LikesService } from '../../../likes/application/likes.service';





@injectable()
export class UpdatePostLikeStatusController {
  constructor(
    @inject(LikesService) private readonly likesService: LikesService,
  ) { };
  handle = async (
    req: Request<{ id: string }, void, LikeStatusInputDto>,
    res: Response<void>,
  ) => {
    try {
      const userId = req.user!.userId;
      const postId = req.params.id;
      await this.likesService.updatePostLikeStatus(postId, userId, req.body.likeStatus);
      res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
      console.error(e);

      errorsHandler(e, res);
    }
  }
}