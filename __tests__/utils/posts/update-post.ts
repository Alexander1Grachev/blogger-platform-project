import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';
import { ResourceType } from '../../../src/core/consts/resource-type';
import { createBlog } from '../blogs/create-blog';
import { PostUpdateInput } from '../../../src/posts/routers/input/post-update.input';
import { getPostDto } from './get-post-dto';

export async function updatePost(
  app: Express,
  postId: string,
  postDto: PostAttributes,
): Promise<void> {
  const blog = await createBlog(app);

  const defaultPostAttributes = getPostDto(blog.data.id);

  const testPostData: PostUpdateInput = {
    data: {
      type: ResourceType.Posts,
      id: postId,
      attributes: {
        ...defaultPostAttributes,
        ...postDto,
      },
    },
  };

  const updatedPostResponse = await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.NoContent);

  return updatedPostResponse.body;
}
