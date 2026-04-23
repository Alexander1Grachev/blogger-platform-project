import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app";
import { clearDb } from "../../utils/clear-db";
import { SECURITY_DEVICES_PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { createUser } from '../../utils/users/create-user';
import { loginAndGetCookies } from '../../utils/auth/login-get-cookies';

describe('Terminate all other (exclude current) devices sessions', () => {
  const app = getTestApp();

  let sessions: { cookies: string[]; userAgent: string }[];

  beforeAll(async () => {
    await clearDb(app);
    sessions = []
    const userAgents = [
      'device-1',
      'device-2',
      'device-3',
      'device-4',
    ];

    const { login, password } = await createUser(app);
    for (let ua of userAgents) {
      const cookies = await loginAndGetCookies(app, { login, password }, { userAgent: ua })
      sessions.push({ cookies, userAgent: ua })
    };

  });

  it('❌ should return 401 if user is not authorized', async () => {
    await request(app)
      .delete(`${SECURITY_DEVICES_PATH}`)
      .set('Cookie', 'refreshToken=invalidToken')
      .expect(HttpStatus.Unauthorized)
  });

  it('✅ should delete all other (exclude current) device\'s sessions successfully', async () => {
    const cookies = sessions[0].cookies
    await request(app)
      .delete(`${SECURITY_DEVICES_PATH}`)
      .set('Cookie', cookies)
      .expect(HttpStatus.NoContent)

    const res = await request(app)
      .get(`${SECURITY_DEVICES_PATH}`)
      .set('Cookie', cookies)
      .expect(HttpStatus.Ok)
    const currentDeviceId = res.body[0].deviceId;

    expect(res.body).toHaveLength(1)
    expect(res.body[0].deviceId).toBe(currentDeviceId);
  });

})