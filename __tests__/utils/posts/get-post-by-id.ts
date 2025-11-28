import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { PostOutput } from '../../../src/posts/routers/output/post.output';

export async function getPostById(
  app: Express,
  postId: string,
): Promise<PostOutput> {
  const getResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(HttpStatus.Ok);

  return getResponse.body;
}
