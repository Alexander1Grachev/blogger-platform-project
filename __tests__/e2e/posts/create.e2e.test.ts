import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPostAsAdmin } from '../../utils/posts/create-post.admin';
import { getTestApp } from '../../setup/start-test-app';
import { clearDb } from '../../utils/clear-db';
import { createBlogAsAdmin } from '../../utils/blogs/create-blog.admin';

describe('CREATE post check', () => {
  const app = getTestApp();

  const adminToken = generateBasicAuthToken();

  let blogId: string;

  beforeAll(async () => {
    await clearDb(app);
    const blog = await createBlogAsAdmin(app);
    blogId = blog.id;
    getPostDto(blogId);
  });

  it('❌ should not create post without auth', async () => {
    await request(app)
      .post(POSTS_PATH)
      .send(getPostDto(blogId))
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create post with wrong auth', async () => {
    await request(app)
      .post(POSTS_PATH)
      .set(
        'Authorization',
        'Basic ' + Buffer.from('wrong:creds').toString('base64'),
      )
      .send(getPostDto(blogId))
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create post with invalid body', async () => {
    const invalidResponse = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({
        title: ' ',
        shortDescription: 'a'.repeat(200),
        content: 'a'.repeat(1100),
        blogId: '507f1f77bcf86cd79943901 ',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidResponse.body.errorsMessages).toHaveLength(4);

    const postList = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok); // всегда 200, список пустой

    expect(postList.body.items).toHaveLength(0);
  });

  it('✅ should create post with valid data & auth', async () => {
    const createdPost = await createPostAsAdmin(app);

    expect(createdPost).toMatchObject({
      id: expect.any(String),
      content: createdPost.content,
      shortDescription: createdPost.shortDescription,
      title: createdPost.title,
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      createdAt: expect.any(String),
    });
  });
});
