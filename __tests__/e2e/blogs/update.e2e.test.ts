import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { updateBlog } from '../../utils/blogs/update-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { createBlog } from '../../utils/blogs/create-blog';
import { getTestApp } from '../../setup/start-test-app';
import { clearDb } from '../../utils/clear-db';
import { BlogInputDto } from '../../../src/blogs/application/dtos/blog-input-dto';

describe('UPDATE blog checks', () => {
  const app = getTestApp();

  const adminToken = generateBasicAuthToken();
  let blogId: string;

  beforeAll(async () => {
    await clearDb(app)
    const blog = await createBlog(app);
    blogId = blog.id
  });

  it('❌ should not update blog with invalid body', async () => {
    const invalidUpdate = await request(app)
      .put(`${BLOGS_PATH}/${blogId}`)
      .set('Authorization', adminToken)
      .send({
        ...getBlogDto(),
        name: '   ', // пустое имя
        description: '', // пустое описание
        websiteUrl: 'http://wrong.com', // должен быть https
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidUpdate.body.errorsMessages).toHaveLength(3);
  });

  it('✅ should update blog with valid data', async () => {
    const blogUpdateData: BlogInputDto = {
      name: 'Update name',
      description: 'Update description',
      websiteUrl: 'https://example.com/update',
    };

    await updateBlog(app, blogId, blogUpdateData);

    // проверяем, что блог реально обновился
    const blogResponse = await getBlogById(app, blogId);

    expect(blogResponse).toMatchObject({
      id: blogId,
      name: blogUpdateData.name,
      description: blogUpdateData.description,
      websiteUrl: blogUpdateData.websiteUrl,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });
});
