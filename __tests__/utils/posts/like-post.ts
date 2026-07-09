import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';

import { PostViewModel } from '../../../src/posts/application/output/post-view-model';
import { LikeStatus } from '../../../src/core/consts/like-statuses';

export async function likePost(
  app: Express,
  postId: string,
  accessToken: string,
  likeStatus: LikeStatus,
): Promise<void> {

  await request(app)
    .put(`${POSTS_PATH}/${postId}/like-status`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ likeStatus })
    .expect(HttpStatus.NoContent)

}
