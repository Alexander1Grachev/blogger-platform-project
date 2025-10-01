import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-model';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';

describe('READ blogs', () => {
  const app = express();
  setupApp(app);

  const correctBlogData: BlogInputDto = getBlogDto()

  let blogId: string;

  beforeAll(async () => {
    blogId = await createFirstBlog(app)
  });


  it('✅ should get blog by id', async () => {
    const blog = await getBlogById(app, blogId)
    expect(blog).toMatchObject({
      // проверяем, что вернулся тот же блог
      id: blogId,
      ...correctBlogData,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });

  it('✅ should get blogs list with at least one blog', async () => {
    const res = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);
    expect(res.body.length).toBeGreaterThanOrEqual(1); // список должен содержать хотя бы 1 блог
  });

  it('❌ should return 404 if blog not found', async () => {
    await request(app)
      .get(`${BLOGS_PATH}/68dd420a59b32c41bb039999`) // несуществующий id
      .expect(HttpStatus.NotFound);
  });
});
