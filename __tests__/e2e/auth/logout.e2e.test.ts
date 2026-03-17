import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app"
import { clearDb } from "../../utils/clear-db";
import { createUser } from "../../utils/users/create-user";
import { AUTH_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { loginAndGetCookies } from '../../utils/auth/login-get-cookies';



describe('Auth logout', () => {
  const app = getTestApp();
  beforeAll(async () => {
    await clearDb(app);
    await createUser(app);
  });

  it('❌should return 401 if cookies not exist ', async () => {
    await request(app)
      .post(`${AUTH_PATH}/logout`)
      .expect(HttpStatus.Unauthorized)
  });

  it('❌should return 401 if refreshToken is invalid(not verify) ', async () => {
    await request(app)
      .post(`${AUTH_PATH}/logout`)
      .set('Cookie', 'refreshToken=invalidToken')
      .expect(HttpStatus.Unauthorized)
  });
  it('✅should logout and invalidate refreshToken', async () => {
    const cookie = await loginAndGetCookies(app);
    await request(app)
      .post(`${AUTH_PATH}/logout`)
      .set('Cookie', cookie )
      .expect(HttpStatus.NoContent)

    // пробуемобновить токены старым refreshToken
    await request(app)
      .post(`${AUTH_PATH}/refresh-token`)
      .set('Cookie', cookie)
      .expect(HttpStatus.Unauthorized);
  });
})


