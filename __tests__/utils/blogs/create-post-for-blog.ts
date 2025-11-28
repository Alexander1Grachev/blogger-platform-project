import { Express } from 'express';
import request from 'supertest';
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';

import { PostCreateInput } from '../../../src/posts/routers/input/post-create.input';
import { ResourceType } from '../../../src/core/consts/resource-type';
import { getPostDto } from '../posts/get-post-dto';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { PostOutput } from '../../../src/posts/routers/output/post.output';

export async function createPostForBlog(
  app: Express,
  blogId: string,
  postDto?: PostAttributes,
): Promise<PostOutput> {
  const defaultPostAttributes = getPostDto(blogId);

  const testPostData: PostCreateInput = {
    data: {
      type: ResourceType.Posts,
      attributes: { ...defaultPostAttributes, ...postDto },
    },
  };

  const createPostResponse = await request(app)
    .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createPostResponse.body;
}
