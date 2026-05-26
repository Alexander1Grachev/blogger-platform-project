import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import {getBlogDto } from './get-blog-dto';
import { BlogInputDto } from '../../../src/blogs/application/dtos/blog-input-dto';

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto?: BlogInputDto,
): Promise<void> {
  const testBlogData: BlogInputDto = {
    ...getBlogDto(),
    ...blogDto,
  };
  await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);

}
