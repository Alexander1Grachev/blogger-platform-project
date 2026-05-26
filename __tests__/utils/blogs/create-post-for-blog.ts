import { Express } from 'express';
import request from 'supertest';

import { getPostDto } from '../posts/get-post-dto';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/application/dtos/post-input-dto';
import { PostViewModel } from '../../../src/posts/application/output/post-view-model';

export async function createPostForBlog(
  app: Express,
  blogId: string,
  postDto?: PostInputDto,
): Promise<PostViewModel> {
  const defaultPostAttributes = getPostDto(blogId);

  const testPostData: PostInputDto = {
    ...defaultPostAttributes, ...postDto
  };

  const createPostResponse = await request(app)
    .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createPostResponse.body;
}
