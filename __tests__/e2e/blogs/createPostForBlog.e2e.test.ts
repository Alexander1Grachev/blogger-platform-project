import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/application/dtos/post-input-dto';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPostForBlog } from '../../utils/blogs/create-post-for-blog';
import { createBlog } from '../../utils/blogs/create-blog';
import { getTestApp } from '../../setup/start-test-app';
import { clearDb } from "../../utils/clear-db";

describe('CREATE post for blog check', () => {
  const app = getTestApp();

  const adminToken = generateBasicAuthToken();
  // Объявляем пременные
  let blogId: string; // сохроняем id блога
  let correctTestPostData: PostInputDto;

  beforeAll(async () => {
    await clearDb(app)
    const blog = await createBlog(app);
    blogId = blog.id
    correctTestPostData = getPostDto(blogId);
  });

  it('❌ should not create post without auth', async () => {
    await request(app)
      .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
      .send(correctTestPostData)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create post with wrong auth', async () => {
    await request(app)
      .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
      .set(
        'Authorization',
        'Basic ' + Buffer.from('wrong:creds').toString('base64'),
      )
      .send(correctTestPostData)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create post with invalid body', async () => {
    const invalidResponse = await request(app)
      .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
      .set('Authorization', adminToken)
      .send({
        title: ' ',
        shortDescription: 'a'.repeat(200),
        content: 'a'.repeat(1100),
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidResponse.body.errorsMessages).toHaveLength(3);

    const allPosts = await request(app)
      .get(POSTS_PATH) //ВСЕ посты в системе
      .expect(HttpStatus.Ok);

    expect(allPosts.body.totalCount).toBe(0);
    //нет случайно созданого поста нигде
  });

  it('✅ should create post with valid data & auth', async () => {
    const createdPostForBlog = await createPostForBlog(app, blogId);

    expect(createdPostForBlog).toMatchObject({
      id: expect.any(String),
      title: correctTestPostData.title,
      shortDescription: correctTestPostData.shortDescription,
      content: correctTestPostData.content,
      blogId: blogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });
});

