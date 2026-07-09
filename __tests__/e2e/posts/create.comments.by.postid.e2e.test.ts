

import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { clearDb } from '../../utils/clear-db';

import { getTestApp } from '../../setup/start-test-app';
import { createUserAndLogin } from '../../utils/users/create-user-n-login.token';
import { getUserDto } from '../../utils/users/get-user-dto';
import { getCommentDto } from '../../utils/comments/get-comment-dto';
import { createBlogAsAdmin } from '../../utils/blogs/create-blog.admin';
import { createPostForBlog } from '../../utils/blogs/create-post-for-blog';
import { createPostAsAdmin } from '../../utils/posts/create-post.admin';



describe('Create post comments', () => {
  const app = getTestApp();
  let postId: string;
  let accessTokenOwner: string;

  beforeAll(async () => {
    await clearDb(app);
    const userOwner = getUserDto();
    const loginResOwner = await createUserAndLogin(app, userOwner);
    accessTokenOwner = loginResOwner.accessToken;
  
    const post = await createPostAsAdmin(app);
    postId = post.id;


  });

  it('❌ should return 404 if post does not exist', async () => {
    const fakePostId = '66efeaadeb3dafea3c3971fb';
    await request(app)
      .post(`${POSTS_PATH}/${fakePostId}/comments`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send(getCommentDto())
      .expect(HttpStatus.NotFound);
  });

  it('✅ should create comment', async () => {
    //console.log('🔍 postId for test:', postId);

    const createResponse = await request(app)
      .post(`${POSTS_PATH}/${postId}/comments`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send(getCommentDto())
      .expect(HttpStatus.Created);

    //console.log('📝 Created comment:', JSON.stringify(createResponse.body, null, 2));

    const getResponse = await request(app)
      .get(`${POSTS_PATH}/${postId}/comments`)
      .expect(HttpStatus.Ok);


    // console.log('📋 GET response body:', JSON.stringify(getResponse.body, null, 2));
    // console.log('📋 GET response length:', getResponse.body.length);

    expect(getResponse.body.items[0]).toEqual(createResponse.body);
    expect(getResponse.body.items.length).toBe(1);
  });


});

