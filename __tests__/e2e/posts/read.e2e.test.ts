import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { createPostAsAdmin } from '../../utils/posts/create-post.admin';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { clearDb } from '../../utils/clear-db';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '../../../src/core/consts/pagination-and-sorting.default';
import { getTestApp } from '../../setup/start-test-app';
import { PostViewModel } from '../../../src/posts/application/output/post-view-model';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createUserAndLogin } from '../../utils/users/create-user-n-login.token';
import { likePost } from '../../utils/posts/like-post';
import { LikeStatus } from '../../../src/core/consts/like-statuses';

describe('READ posts', () => {
  const app = getTestApp();

  let postId: string;
  let createdPost: PostViewModel;

  beforeAll(async () => {
    await clearDb(app);
    createdPost = await createPostAsAdmin(app);
    postId = createdPost.id;
  });

  it('✅ should get post by id', async () => {
    const post = await getPostById(app, postId);

    //cравниваем с ПОЛНЫМ объектом, который вернул сервер
    expect(post).toEqual(createdPost);
  });

  it('✅ should get posts list with at least one post', async () => {
    await createPostAsAdmin(app);

    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    // Базовая проверка структуры
    expect(response.body).toBeDefined();

    // Проверка согласованности данных и пагинации
    expect(response.body.items).toHaveLength(2);
    expect(response.body.totalCount).toBe(2);
    expect(response.body.page).toBe(DEFAULT_PAGE_NUMBER);
    expect(response.body.pageSize).toBe(DEFAULT_PAGE_SIZE);
    expect(response.body.pagesCount).toBe(1); // 2/10 = 1 страница
  });

  it('✅ should handle multiple pages', async () => {
    //Создаем 13 постов (+2 что уже есть) = 15
    for (let i = 0; i < 13; i++) {
      await createPostAsAdmin(app);
    }

    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(response.body.totalCount).toBe(15);
    expect(response.body.pagesCount).toBe(2); // 15/10 = 2 страницы
    expect(response.body.items).toHaveLength(10); // первая страница = 10 постов
  });

  it('✅ should respect custom pageSize', async () => {
    const response = await request(app)
      .get(`${POSTS_PATH}?pageSize=5`)
      .expect(HttpStatus.Ok);

    expect(response.body.pageSize).toBe(5);
    expect(response.body.items).toHaveLength(5); // 5 постов на странице
  });

  it('✅ should respect page parameter', async () => {
    const response = await request(app)
      .get(`${POSTS_PATH}?pageNumber=2&pageSize=5`)
      .expect(HttpStatus.Ok);

    expect(response.body.page).toBe(2);
    expect(response.body.pageSize).toBe(5);
    // На второй странице должны быть посты с 6 по 10
  });

  it('✅ should return empty array when no posts ', async () => {
    await clearDb(app);
    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(response.body.items).toHaveLength(0);
    expect(response.body.pagesCount).toBe(0);
    expect(response.body.totalCount).toBe(0);
  });

  it('❌ should return 404 if post not found', async () => {
    await request(app)
      .get(`${POSTS_PATH}/68dd420a59b32c41bb039999`)
      .expect(HttpStatus.NotFound);
  });
  describe('extendedLikesInfo', () => {
    let postId: string;

    let user1: ReturnType<typeof getUserDto>;
    let accessTokenUser1: string;

    let user2: ReturnType<typeof getUserDto>;
    let accessTokenUser2: string;

    let user3: ReturnType<typeof getUserDto>;
    let accessTokenUser3: string;

    let user4: ReturnType<typeof getUserDto>;
    let accessTokenUser4: string;

    beforeAll(async () => {
      await clearDb(app);


      // Пост без лайков 1
      await createPostAsAdmin(app);
      // проверяемый пост
      const post = await createPostAsAdmin(app);
      postId = post.id;
      // Пост без лайков 2
      await createPostAsAdmin(app);

      user1 = getUserDto();
      const loginResUser1 = await createUserAndLogin(app, user1);
      accessTokenUser1 = loginResUser1.accessToken;
      await likePost(app, postId, accessTokenUser1, LikeStatus.Like);

      user2 = getUserDto();
      ({ accessToken: accessTokenUser2 } = await createUserAndLogin(app, user2));
      await likePost(app, postId, accessTokenUser2, LikeStatus.Like);

      user3 = getUserDto();
      ({ accessToken: accessTokenUser3 } = await createUserAndLogin(app, user3));
      await likePost(app, postId, accessTokenUser3, LikeStatus.Like);

      user4 = getUserDto();
      ({ accessToken: accessTokenUser4 } = await createUserAndLogin(app, user4));
      await likePost(app, postId, accessTokenUser4, LikeStatus.Like);
    });

    it('should return myStatus=None for anonymous user', async () => {
      // GET /posts/:id без токена
      const post = await getPostById(app, postId);

      expect(post.extendedLikesInfo.myStatus).toEqual('None');
    });

    it('should return myStatus=Like for authorized user', async () => {
      // GET /posts/:id с accessTokenUser2
      const res = await request(app)
        .get(`${POSTS_PATH}/${postId}`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(HttpStatus.Ok);

      expect(res.body.extendedLikesInfo.myStatus).toEqual('Like');
    });

    it('should return only 3 newest likes', async () => {
      // newestLikes.length === 3
      // user4
      // user3
      // user2
      const res = await request(app)
        .get(`${POSTS_PATH}/${postId}`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(HttpStatus.Ok);

      expect(res.body.extendedLikesInfo.newestLikes).toHaveLength(3);
      expect(res.body.extendedLikesInfo.newestLikes[0].login).toBe(user4.login);
      expect(res.body.extendedLikesInfo.newestLikes[1].login).toBe(user3.login);
      expect(res.body.extendedLikesInfo.newestLikes[2].login).toBe(user2.login);

    });

    it('should return extendedLikesInfo in posts list', async () => {
      // GET /posts
      // найти нужный пост
      // проверить myStatus и newestLikes
      const res = await request(app)
        .get(`${POSTS_PATH}`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(HttpStatus.Ok);

      const likedPost = res.body.items.find((p: PostViewModel) => p.id === postId);

      expect(likePost).toBeDefined();

      expect(likedPost!.extendedLikesInfo.likesCount).toBe(4);
      expect(likedPost!.extendedLikesInfo.dislikesCount).toBe(0);
      expect(likedPost!.extendedLikesInfo.myStatus).toBe(LikeStatus.Like);
      expect(likedPost!.extendedLikesInfo.newestLikes).toHaveLength(3);

      // пустые посты 
      const otherPosts = res.body.items.filter((p: PostViewModel) => p.id !== postId);
      expect(otherPosts).toHaveLength(2);

      for (const post of otherPosts) {
        expect(post.extendedLikesInfo.likesCount).toBe(0);
        expect(post.extendedLikesInfo.dislikesCount).toBe(0);
        expect(post.extendedLikesInfo.myStatus).toBe(LikeStatus.None);
        expect(post.extendedLikesInfo.newestLikes).toEqual([]);
      }

    });
  });
});
