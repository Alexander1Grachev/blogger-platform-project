import request from 'supertest';

import { getTestApp } from "../../setup/start-test-app"
import { clearDb } from '../../utils/clear-db';
import { AUTH_PATH, USERS_PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createUserAndLogin } from '../../utils/create-user-n-login.token';






describe('READ me info', () => {
  const app = getTestApp();
  const adminToken = generateBasicAuthToken()
  beforeAll(async () => {
    await clearDb(app);
  });

  it('❌ should return 401 with wrong accessToken', async () => {
    await request(app)
      .get(`${AUTH_PATH}/me`)
      .set('Authorization', 'Bearer wrong.token.value')
      .expect(HttpStatus.Unauthorized)
  });

  it('❌ should return 401 without accessToken', async () => {
    await request(app)
      .get(`${AUTH_PATH}/me`)
      .expect(HttpStatus.Unauthorized)
  });

  it('✅ should return me info', async () => {
    const userDto = {
      login: 'test',
      password: '123456',
      email: 'test@mail.com',
    }

    const { accessToken } = await createUserAndLogin(app, userDto)

    const res = await request(app)
      .get(`${AUTH_PATH}/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.Ok)

    expect(res.body).toEqual({
      email: 'test@mail.com',
      login: 'test',
      userId: expect.any(String),
    })
  });
})