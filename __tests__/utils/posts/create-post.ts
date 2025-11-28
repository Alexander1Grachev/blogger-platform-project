import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getPostDto } from './get-post-dto';
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';

import { PostOutput } from '../../../src/posts/routers/output/post.output';
import { createBlog } from '../blogs/create-blog';
import { ResourceType } from '../../../src/core/consts/resource-type';

export async function createPost(
  app: Express,
  postDto?: PostAttributes,
): Promise<PostOutput> {
  const blog = await createBlog(app);

  const defaultPostAttributes = getPostDto(blog.data.id);

  const testPostData = {
    data: {
      type: ResourceType.Posts,
      attributes: { ...defaultPostAttributes, ...postDto },
    },
  };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createdPostResponse.body;
}
