import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app";
import { clearDb } from "../../utils/clear-db";
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { loginAndGetCookies } from '../../utils/auth/login-get-cookies';
import { SECURITY_DEVICES_PATH } from '../../../src/core/paths/paths';
import { extractCookie } from '../../utils/security-devices/extract-cookie';
import { jwtService } from '../../../src/auth/adapters/jwt.service';
import jwt from "jsonwebtoken";
import { appConfig } from '../../../src/core/config/config';
import { createUser } from '../../utils/users/create-user';


describe('Terminate specified device session', () => {
  const app = getTestApp();

  let userId: string;
  let deviceId: string;
  let iat: number;
  let exp: number;
  let refreshToken: string;
  let sessions: { cookies: string[]; userAgent: string }[];

  beforeAll(async () => {
    await clearDb(app);
    sessions = []; // кешируем данные, которые сервер уже создал.
    const userAgents = [
      'device-1',
      'device-2',
      'device-3',
      'device-4',
    ];
    const { login, password } = await createUser(app);

    for (let ua of userAgents) {
      const cookies = await loginAndGetCookies(app, { login, password }, { userAgent: ua });
      sessions.push({ cookies, userAgent: ua });
    };

    refreshToken = extractCookie(sessions[0].cookies, 'refreshToken');
    if (!refreshToken) {
      throw new Error('refreshToken not found');
    };
    const payload = jwtService.decodeToken(refreshToken);
    // ожидаем что токен валидный и декодируется 
    expect(payload).toBeDefined();
    expect(payload).toHaveProperty('userId');
    expect(payload).toHaveProperty('deviceId');
    expect(payload).toHaveProperty('iat');
    expect(payload).toHaveProperty('exp');

    userId = payload!.userId!;
    deviceId = payload!.deviceId; // после проверки --> точно не null
    iat = payload!.iat!;
    exp = payload!.exp!;
  });

  it('❌ should return 401 if user is not authorized', async () => {
    await request(app)
      .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
      .set('Cookie', 'refreshToken=invalidToken')
      .expect(HttpStatus.Unauthorized)

    // iat Unauthorized
    const invalidIatToken = jwt.sign(
      { userId, deviceId, iat: 0, exp: exp }, // payload
      appConfig.RT_SECRET
    );
    await request(app)
      .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
      .set('Cookie', `refreshToken=${invalidIatToken}`)
      .expect(HttpStatus.Unauthorized);

    // exp Unauthorized
    const expiredToken = jwt.sign(
      { userId: userId, deviceId: deviceId, iat: iat, exp: 1 },
      appConfig.RT_SECRET
    );
    await request(app)
      .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
      .set('Cookie', `refreshToken=${expiredToken}`)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should return 403 if trying to delete another user\'s device', async () => {
    const { login, password } = await createUser(app);

    const userACookies = await loginAndGetCookies(app, { login, password });
    await request(app)
      .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
      .set('Cookie', userACookies)
      .expect(HttpStatus.Forbidden)
  });

  it('❌ should return 404 if deviceId does not exist', async () => {
    const unknownDeviceId = crypto.randomUUID();
    await request(app)
      .delete(`${SECURITY_DEVICES_PATH}/${unknownDeviceId}`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(HttpStatus.NotFound)
  });

  it('✅ should delete specified device session successfully', async () => {
    const secondDeviceRefreshToken = extractCookie(sessions[1].cookies, 'refreshToken')
    await request(app)
      .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(HttpStatus.NoContent)

    const res = await request(app)
      .get(`${SECURITY_DEVICES_PATH}`)
      .set('Cookie', `refreshToken=${secondDeviceRefreshToken}`)
      .expect(HttpStatus.Ok)

    expect(res.body).toHaveLength(3);// кол-во девайсов не индаксы масива, не 2 
    expect(res.body.find((d: any) => d.deviceId === deviceId)).toBeUndefined();//<---
  });

})

