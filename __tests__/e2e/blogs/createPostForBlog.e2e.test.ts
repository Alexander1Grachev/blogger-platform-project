import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { PostCreateInput } from '../../../src/posts/routers/input/post-create.input';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { ResourceType } from '../../../src/core/consts/resource-type';
import { createPostForBlog } from '../../utils/blogs/create-post-for-blog';

describe('CREATE post for blog check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  // Объявляем пременные
  let blogId: string; // сохроняем id блога
  let correctTestPostData: PostCreateInput;

  beforeAll(async () => {
    blogId = await createFirstBlog(app);
    correctTestPostData = {
      data: {
        type: ResourceType.Posts,
        attributes: getPostDto(blogId),
      },
    };
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
        data: {
          ...correctTestPostData.data,
          attributes: {
            title: ' ',
            shortDescription: 'a'.repeat(200),
            content: 'a'.repeat(1100),
            blogId: 123,
          },
        },
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidResponse.body.errors).toHaveLength(4);

    const allPosts = await request(app)
      .get(POSTS_PATH) //ВСЕ посты в системе
      .expect(HttpStatus.Ok);

    expect(allPosts.body.data).toHaveLength(0); //нет случайно созданого поста нигде
  });

  it('✅ should create post with valid data & auth', async () => {
    const createdPostForBlog = await createPostForBlog(app, blogId);

    expect(createdPostForBlog).toMatchObject({
      data: {
        type: ResourceType.Posts,
        id: expect.any(String),
        attributes: {
          ...correctTestPostData.data.attributes,
          blogName: expect.any(String),
          createdAt: expect.any(String),
        },
      },
    });
  });
});
