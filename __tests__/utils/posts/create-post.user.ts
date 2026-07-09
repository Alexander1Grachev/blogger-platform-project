import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { getPostDto } from './get-post-dto';

import { PostInputDto } from '../../../src/posts/application/dtos/post-input-dto';
import { PostViewModel } from '../../../src/posts/application/output/post-view-model';
import { createBlogAsUser } from '../blogs/create-blog.user';

export async function createPostAsUser(
  app: Express,
  accessToken: string,
  postDto?: PostInputDto,

): Promise<PostViewModel> {
  const blogId = (await createBlogAsUser(app, accessToken)).id;

  const defaultPostAttributes = getPostDto(blogId);
  const postData = { ...defaultPostAttributes, ...postDto };

  const res = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(postData)
    .expect(HttpStatus.Created);

  return res.body;
}
