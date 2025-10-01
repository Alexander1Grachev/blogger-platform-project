import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { updateBlog } from '../../utils/blogs/update-blog';

describe('UPDATE blog checks', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
  let blogId: string;

  beforeAll(async () => {
    blogId = await createFirstBlog(app)
  });



  it('❌ should not update blog with invalid body', async () => {
    const invalidUpdate = await request(app)
      .put(`${BLOGS_PATH}/${blogId}`)
      .set('Authorization', adminToken)
      .send({
        name: '   ', // пустое имя
        description: '', // пустое описание
        websiteUrl: 'http://wrong.com', // должен быть https
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidUpdate.body.errorsMessages).toHaveLength(3);
  });

  it('✅ should update blog with valid data', async () => {

    const updatedBlogData: BlogInputDto = {
      name: 'UpdatedBlog',
      description: 'New description',
      websiteUrl: 'https://updated.com',
    };


    await updateBlog(app, blogId, updatedBlogData)

    // проверяем, что блог реально обновился
    const res = await request(app)
      .get(`${BLOGS_PATH}/${blogId}`)
      .expect(HttpStatus.Ok);
    expect(res.body).toMatchObject({
      id: blogId,
      ...updatedBlogData,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean), 
    });
  });
});
