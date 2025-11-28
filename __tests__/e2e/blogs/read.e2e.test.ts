import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { ResourceType } from '../../../src/core/consts/resource-type';
import { createBlog } from '../../utils/blogs/create-blog';
import { correctTestBlogAttributes } from '../../utils/blogs/get-blog-dto';

describe('READ blogs', () => {
  const app = express();
  setupApp(app);

  let blogId: string;

  beforeAll(async () => {
    blogId = await createFirstBlog(app);
  });

  it('✅ should get blog by id', async () => {
    const blog = await getBlogById(app, blogId);
    expect(blog).toMatchObject({
      // проверяем, что вернулся тот же блог
      data: {
        type: ResourceType.Blogs,
        id: blogId,
        attributes: {
          ...correctTestBlogAttributes,
          createdAt: expect.any(String),
          isMembership: expect.any(Boolean),
        },
      },
    });
  });

  it('✅ should get blogs list with at least one blog', async () => {
    await createBlog(app);
    const res = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

    expect(res.body.data.length).toBeGreaterThanOrEqual(2); // список должен содержать хотя бы 2 блога
  });

  it('❌ should return 404 if blog not found', async () => {
    await request(app)
      .get(`${BLOGS_PATH}/68dd420a59b32c41bb039999`) // несуществующий id
      .expect(HttpStatus.NotFound);
  });
});
