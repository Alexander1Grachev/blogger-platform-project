import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

import { correctTestBlogAttributes } from './get-blog-dto';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';
import { BlogUpdateInput } from '../../../src/blogs/routers/input/blog-update.input';
import { ResourceType } from '../../../src/core/consts/resource-type';

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto?: BlogAttributes,
): Promise<void> {
  const testBlogData: BlogUpdateInput = {
    data: {
      type: ResourceType.Blogs,
      id: blogId,
      attributes: {
        ...correctTestBlogAttributes,
        ...blogDto,
      },
    },
  };

  const updatedBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);

  return updatedBlogResponse.body;
}
