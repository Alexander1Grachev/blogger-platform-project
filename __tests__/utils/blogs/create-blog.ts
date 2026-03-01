import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';

import { getBlogDto } from './get-blog-dto';
import { BlogInputDto } from '../../../src/blogs/application/dtos/blog-input-model';
import { BlogViewModel } from '../../../src/blogs/application/output/blog-view-model';

export async function createBlog(
  app: Express,
  blogDto?: BlogInputDto,
): Promise<BlogViewModel> {

  const testBlogData: BlogInputDto = { ...getBlogDto(), ...blogDto }


  const createBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createBlogResponse.body;
}
