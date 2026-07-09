import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { mapToPostOutput } from '../../application/mappers/map-to-post-output.util';
import { PostsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";
import { AuthService } from '../../../auth/application/auth-user.service';


@injectable()
export class GetPostController {
  constructor(
    @inject(PostsService) private readonly postsService: PostsService,
    @inject(AuthService) private readonly authService: AuthService
  ) { };

  handle = async (
    req: Request<{ id: string }>,
    res: Response,
  ) => {
    try {
      const postId = req.params.id;
      const userId = req.user?.userId ?? null;
      const { post, myStatus, newestLikes } = await this.postsService.findById({ postId, userId });
      const postOutput = mapToPostOutput({
        post,
        myStatus,
        newestLikes
      })
      res.status(HttpStatus.Ok).send(postOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}