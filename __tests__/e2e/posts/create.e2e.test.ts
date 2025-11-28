import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { ResourceType } from '../../../src/core/consts/resource-type';
import { PostCreateInput } from '../../../src/posts/routers/input/post-create.input';
import { getTestApp } from '../../setup/start-test-app';
import { clearDb } from '../../utils/clear-db';
import { createBlog } from '../../utils/blogs/create-blog';

describe('CREATE post check', () => {
  const app = getTestApp();

  const adminToken = generateBasicAuthToken();

  let blogId: string;
  let correctTestPostData: PostCreateInput;

  beforeAll(async () => {
    await clearDb(app);
    const blog = await createBlog(app);
    blogId = blog.data.id;

    correctTestPostData = {
      data: {
        type: ResourceType.Posts,
        attributes: getPostDto(blogId),
      },
    };
  });

  it('❌ should not create post without auth', async () => {
    await request(app)
      .post(POSTS_PATH)
      .send(correctTestPostData)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create post with wrong auth', async () => {
    await request(app)
      .post(POSTS_PATH)
      .set(
        'Authorization',
        'Basic ' + Buffer.from('wrong:creds').toString('base64'),
      )
      .send(correctTestPostData)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create post with invalid body', async () => {
    const invalidResponse = await request(app)
      .post(POSTS_PATH)
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

    const postList = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok); // всегда 200, список пустой

    expect(postList.body.data).toHaveLength(0);
  });

  it('✅ should create post with valid data & auth', async () => {
    const createdPost = await createPost(app);

    expect(createdPost).toMatchObject({
      data: {
        type: ResourceType.Posts,
        id: expect.any(String),
        attributes: {
          content: createdPost.data.attributes.content,
          shortDescription: createdPost.data.attributes.shortDescription,
          title: createdPost.data.attributes.title,
          blogId: createdPost.data.attributes.blogId,
          blogName: createdPost.data.attributes.blogName,
          createdAt: expect.any(String),
        },
      },
    });
  });
});
