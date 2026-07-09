import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getPostDto } from './get-post-dto';

import { createBlogAsAdmin } from '../blogs/create-blog.admin';
import { PostInputDto } from '../../../src/posts/application/dtos/post-input-dto';
import { PostViewModel } from '../../../src/posts/application/output/post-view-model';

export async function createPostAsAdmin(
  app: Express,
  postDto?: PostInputDto
): Promise<PostViewModel> {
  const blogId = (await createBlogAsAdmin(app)).id

  const defaultPostAttributes = getPostDto(blogId);
  const postData = { ...defaultPostAttributes, ...postDto };

  const res = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(postData)
    .expect(HttpStatus.Created);

  return res.body;
}
