import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app";
import { clearDb } from "../../utils/clear-db";
import { createUser } from "../../utils/users/create-user";
import { AUTH_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { loginAndGetCookies } from '../../utils/auth/login-get-cookies';


describe('Auth refreshToken', () => {
  const app = getTestApp();
  beforeAll(async () => {
    await clearDb(app);

  });
  it('❌should return 401 if cookies not exist', async () => {
    await request(app)
      .post(`${AUTH_PATH}/refresh-token`)
      .expect(HttpStatus.Unauthorized)
  });

  it('❌ should return 401 if refreshToken is invalid(not verify)', async () => {
    await request(app)
      .post(`${AUTH_PATH}/refresh-token`)
      .set('Cookie', 'refreshToken=invalidToken')//  JWT не проходит verify  сервер возвращает 401.
      .expect(HttpStatus.Unauthorized)
  });

  it('✅ should revoke old refreshToken and prevent reuse', async () => {
    const { login, password } = await createUser(app)
    const cookie = await loginAndGetCookies(app, { login, password }); 

    // 👇 ждём хотя бы 1 сек, чтобы новый RT получил другой iat
    await new Promise(res => setTimeout(res, 1100));

    // первый refresh  новый токен
    const firstRes = await request(app)
      .post(`${AUTH_PATH}/refresh-token`)
      .set('Cookie', cookie)
      .expect(HttpStatus.Ok);

    expect(firstRes.body).toHaveProperty('accessToken');

    // Получаем новый refreshToken
    const newCookie = firstRes.header['set-cookie'][0].split(';')[0];

    // повторное использование старого токена 
    await request(app)
      .post(`${AUTH_PATH}/refresh-token`)
      .set('Cookie', cookie)
      .expect(HttpStatus.Unauthorized);

    // использование нового токена 
    const secondRes = await request(app)
      .post(`${AUTH_PATH}/refresh-token`)
      .set('Cookie', newCookie)
      .expect(HttpStatus.Ok);

    expect(secondRes.body).toHaveProperty('accessToken');
  });
})

