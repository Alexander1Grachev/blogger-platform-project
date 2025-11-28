import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

import { getBlogDto } from './get-blog-dto';
import { BlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';
import { BlogCreateInput } from '../../../src/blogs/routers/input/blog-create.input';
import { ResourceType } from '../../../src/core/consts/resource-type';

export async function createBlog(
  app: Express,
  blogDto?: BlogAttributes,
): Promise<BlogOutput> {
  const testBlogData: BlogCreateInput = {
    data: {
      type: ResourceType.Blogs,
      attributes: { ...getBlogDto(), ...blogDto },
    },
  };

  const createBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createBlogResponse.body;
}
