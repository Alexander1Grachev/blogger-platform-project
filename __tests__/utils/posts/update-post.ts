import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { createBlogAsAdmin } from '../blogs/create-blog.admin';
import { getPostDto } from './get-post-dto';
import { PostInputDto } from '../../../src/posts/application/dtos/post-input-dto';

export async function updatePost(
  app: Express,
  postId: string,
  postDto: PostInputDto,
): Promise<void> {
  const blog = await createBlogAsAdmin(app);

  const defaultPostAttributes = getPostDto(blog.id);

  const testPostData = {
    id: postId,
    ...defaultPostAttributes,
    ...postDto,
  };

  await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.NoContent);

}
