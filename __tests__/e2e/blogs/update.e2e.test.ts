import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { correctTestBlogAttributes } from '../../utils/blogs/get-blog-dto';
import { updateBlog } from '../../utils/blogs/update-blog';
import { ResourceType } from '../../../src/core/consts/resource-type';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';

describe('UPDATE blog checks', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
  let blogId: string;

  beforeAll(async () => {
    blogId = await createFirstBlog(app);
  });

  it('❌ should not update blog with invalid body', async () => {
    const invalidUpdate = await request(app)
      .put(`${BLOGS_PATH}/${blogId}`)
      .set('Authorization', adminToken)
      .send({
        data: {
          type: ResourceType.Blogs,
          id: blogId,
          attributes: {
            ...correctTestBlogAttributes,
            name: '   ', // пустое имя
            description: '', // пустое описание
            websiteUrl: 'http://wrong.com', // должен быть https
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidUpdate.body.errors).toHaveLength(3);
  });

  it('✅ should update blog with valid data', async () => {
    const blogUpdateData: BlogAttributes = {
      name: 'Update name',
      description: 'Update description',
      websiteUrl: 'https://example.com/update',
    };

    await updateBlog(app, blogId, blogUpdateData);

    // проверяем, что блог реально обновился
    const blogResponse = await getBlogById(app, blogId);

    expect(blogResponse.data.id).toBe(blogId);
    expect(blogResponse.data.attributes).toEqual({
      name: blogUpdateData.name,
      description: blogUpdateData.description,
      websiteUrl: blogUpdateData.websiteUrl,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });
});
