import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { PostViewModel } from '../../../src/posts/application/output/post-view-model';

export async function getPostById(
  app: Express,
  postId: string,
): Promise<PostViewModel> {
  const getResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(HttpStatus.Ok);

  return getResponse.body;
}
