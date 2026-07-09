import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app"
import { clearDb } from "../../utils/clear-db";
import { getUserDto } from '../../utils/users/get-user-dto';
import { createUserAndLogin } from '../../utils/users/create-user-n-login.token';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { createPostAsAdmin } from '../../utils/posts/create-post.admin';



describe('UPDATE post like-status', () => {
  const app = getTestApp();
  let postId: string;
  let accessTokenOwner: string;
  let accessTokenOther: string;
  let userOwner: ReturnType<typeof getUserDto>;
  let userOther: ReturnType<typeof getUserDto>;

  beforeAll(async () => {
    await clearDb(app);
    
    userOwner = getUserDto();
    const loginResOwner = await createUserAndLogin(app, userOwner);
    accessTokenOwner = loginResOwner.accessToken;

    userOther = getUserDto();
    const loginResOther = await createUserAndLogin(app, userOther);
    accessTokenOther = loginResOther.accessToken;


    const post = await createPostAsAdmin(app);
    postId = post.id;
  });

  it('❌ should return 401 if not authenticated', async () => {
    await request(app)
      .put(`${POSTS_PATH}/${postId}/like-status`)
      .set('Authorization', `Bearer invalidtoken123`)
      .send({ likeStatus: "Like" })
      .expect(HttpStatus.Unauthorized)

    // вход без авторизации
    await request(app)
      .put(`${POSTS_PATH}/${postId}/like-status`)
      .send({ likeStatus: "Dislike" })
      .expect(HttpStatus.Unauthorized)
  });

  it('❌ should return 404 if post does not exist', async () => {
    // сценарий где я подаю не нушествующий postId 
    const fakepostId = '66efeaadeb3dafea3c3971fb';
    await request(app)
      .put(`${POSTS_PATH}/${fakepostId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: "Like" })
      .expect(HttpStatus.NotFound)
  });

  it('❌ should return 400 if inputModel is invalid', async () => {
    await request(app)
      .put(`${POSTS_PATH}/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: "invalid" })
      .expect(HttpStatus.BadRequest)
  });

  it('✅ should update post like-status by id (owner)', async () => {
    await request(app)
      .put(`${POSTS_PATH}/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: "Dislike" })
      .expect(HttpStatus.NoContent)

    const res = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)

    expect(res.body.extendedLikesInfo.myStatus).toBe('Dislike')
  })


  it('✅ should increment extendedLikesInfo two users like same post', async () => {

    await request(app)
      .put(`${POSTS_PATH}/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: "Like" })
      .expect(HttpStatus.NoContent)

    await request(app)
      .put(`${POSTS_PATH}/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOther}`)
      .send({ likeStatus: "Like" })
      .expect(HttpStatus.NoContent)

    const res = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)

    expect(res.body.extendedLikesInfo.likesCount).toBe(2)
    expect(res.body.extendedLikesInfo.dislikesCount).toBe(0)

    expect(res.body.extendedLikesInfo.newestLikes).toHaveLength(2);

    expect(res.body.extendedLikesInfo.newestLikes[0].login).toBe(userOther.login);
    expect(res.body.extendedLikesInfo.newestLikes[1].login).toBe(userOwner.login);
  })
})