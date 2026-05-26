import request from 'supertest';
import { Express } from 'express';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BlogViewModel } from '../../../src/blogs/application/output/blog-view-model';

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<BlogViewModel> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(HttpStatus.Ok);

  return blogResponse.body;
}
