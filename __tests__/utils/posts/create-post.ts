import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getPostDto } from './get-post-dto';

import { createBlog } from '../blogs/create-blog';
import { PostInputDto } from '../../../src/posts/application/dtos/post-input-model';
import { PostViewModel } from '../../../src/posts/application/output/post-view-model';

export async function createPost(
  app: Express,
  postDto?: PostInputDto,
): Promise<PostViewModel> {
  const blog = await createBlog(app);

  const defaultPostAttributes = getPostDto(blog.id);

  const postData = { ...defaultPostAttributes, ...postDto };
  const res = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(postData)
    .expect(HttpStatus.Created);

  return res.body; 
}
