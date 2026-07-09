import request from 'supertest';

import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { createPostForBlog } from '../../utils/blogs/create-post-for-blog';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { createBlogAsAdmin } from '../../utils/blogs/create-blog.admin';
import { clearDb } from '../../utils/clear-db';
import { PostViewModel } from '../../../src/posts/application/output/post-view-model';
import { getTestApp } from '../../setup/start-test-app';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createUserAndLogin } from '../../utils/users/create-user-n-login.token';
import { likePost } from '../../utils/posts/like-post';
import { LikeStatus } from '../../../src/core/consts/like-statuses';

describe('', () => {
  const app = getTestApp();

  let blogId: string;
  let postId: string;
  let createdPost: PostViewModel;
  let user1: ReturnType<typeof getUserDto>;
  let accessTokenUser1: string;

  beforeAll(async () => {
    await clearDb(app)
    const blog = await createBlogAsAdmin(app);
    blogId = blog.id

    createdPost = await createPostForBlog(app, blogId);
    postId = createdPost.id

    user1 = getUserDto();
    ({ accessToken: accessTokenUser1 } = await createUserAndLogin(app, user1))
    await likePost(app, postId, accessTokenUser1, LikeStatus.Like);
  });

  it('✅ should get post by blog id', async () => {
    const response = await request(app)
      .get(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
      .set('Authorization', `Bearer ${accessTokenUser1}`)
      .expect(HttpStatus.Ok);

    expect(response.body.items).toHaveLength(1); // массив из 1 поста
    expect(response.body.totalCount).toBe(1); // проверяем общее количество
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(10);

    const likedPost = response.body.items.find((p: PostViewModel) => p.id === postId);

    expect(likePost).toBeDefined();

    expect(likedPost!.extendedLikesInfo.newestLikes[0].login).toBe(user1.login);

    expect(likedPost!.extendedLikesInfo.likesCount).toBe(1);
    expect(likedPost!.extendedLikesInfo.dislikesCount).toBe(0);
    expect(likedPost!.extendedLikesInfo.myStatus).toBe(LikeStatus.Like);
    expect(likedPost!.extendedLikesInfo.newestLikes).toHaveLength(1);
  });
});
