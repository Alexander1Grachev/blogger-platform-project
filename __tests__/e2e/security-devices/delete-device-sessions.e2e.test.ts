import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app";
import { clearDb } from "../../utils/clear-db";
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { loginAndGetCookies } from '../../utils/auth/login-get-cookies';
import { SECURITY_DEVICES_PATH } from '../../../src/core/paths/paths';
import { extractCookie } from '../../utils/security-devices/extract-cookie';
import { JwtService } from '../../../src/auth/adapters/jwt.service';
import jwt from "jsonwebtoken";
import { appConfig } from '../../../src/core/config/config';
import { createUser } from '../../utils/users/create-user';
import { container } from '../../../src/composition-root';

describe('Terminate specified device session', () => {
  const app = getTestApp();
  const jwtService = container.get(JwtService);

  describe('❌ should return 401 if user is not authorized', () => {
    it('should return 401 with invalid token format', async () => {
      await clearDb(app);
      const { login, password } = await createUser(app);
      const cookies = await loginAndGetCookies(app, { login, password });

      // Получаем deviceId из реального токена
      const refreshToken = extractCookie(cookies, 'refreshToken');
      const payload = jwtService.decodeToken(refreshToken) as any;
      const deviceId = payload.deviceId;

      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
        .set('Cookie', ['refreshToken=invalidToken'])
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 with token signed with wrong secret', async () => {
      await clearDb(app);
      const { login, password } = await createUser(app);
      const cookies = await loginAndGetCookies(app, { login, password });

      const refreshToken = extractCookie(cookies, 'refreshToken');
      const payload = jwtService.decodeToken(refreshToken) as any;
      const deviceId = payload.deviceId;

      // Токен с неправильным секретом
      const wrongSecretToken = jwt.sign(
        { userId: payload.userId, deviceId, iat: payload.iat, exp: payload.exp },
        'wrong-secret-key'
      );

      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
        .set('Cookie', [`refreshToken=${wrongSecretToken}`])
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 with expired token', async () => {
      await clearDb(app);
      const { login, password } = await createUser(app);
      const cookies = await loginAndGetCookies(app, { login, password });

      const refreshToken = extractCookie(cookies, 'refreshToken');
      const payload = jwtService.decodeToken(refreshToken) as any;
      const deviceId = payload.deviceId;

      // Создаём токен с временем жизни 1ms (уже истекший)
      const expiredToken = jwt.sign(
        { userId: payload.userId, deviceId },
        appConfig.RT_SECRET,
        { expiresIn: '1ms' }
      );

      // Даём время токену истечь
      await new Promise(resolve => setTimeout(resolve, 10));

      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
        .set('Cookie', [`refreshToken=${expiredToken}`])
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 with token issued in the future', async () => {
      await clearDb(app);
      const { login, password } = await createUser(app);
      const cookies = await loginAndGetCookies(app, { login, password });

      const refreshToken = extractCookie(cookies, 'refreshToken');
      const payload = jwtService.decodeToken(refreshToken) as any;
      const deviceId = payload.deviceId;

      // Токен, выданный в будущем (через 1 час)
      const futureIat = Math.floor(Date.now() / 1000) + 3600;
      const futureToken = jwt.sign(
        { userId: payload.userId, deviceId, iat: futureIat },
        appConfig.RT_SECRET,
        { expiresIn: '1h' }
      );

      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
        .set('Cookie', [`refreshToken=${futureToken}`])
        .expect(HttpStatus.Unauthorized);
    });
  });

  describe('❌ should return 403 if trying to delete another user\'s device', () => {
    it('should return 403 for cross-user device deletion', async () => {
      await clearDb(app);

      // Создаём двух пользователей
      const user1 = await createUser(app);
      const user2 = await createUser(app);

      // Логинимся обоими
      const user1Cookies = await loginAndGetCookies(app, {
        login: user1.login,
        password: user1.password
      }, { userAgent: 'user1-agent' });

      const user2Cookies = await loginAndGetCookies(app, {
        login: user2.login,
        password: user2.password
      }, { userAgent: 'user2-agent' });

      // Получаем deviceId первого пользователя
      const user1RefreshToken = extractCookie(user1Cookies, 'refreshToken');
      const user1Payload = jwtService.decodeToken(user1RefreshToken) as any;
      const user1DeviceId = user1Payload.deviceId;

      // Пытаемся удалить deviceId user1, используя токен user2
      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}/${user1DeviceId}`)
        .set('Cookie', user2Cookies)
        .expect(HttpStatus.Forbidden);
    });
  });

  describe('❌ should return 404 if deviceId does not exist', () => {
    it('should return 404 for non-existent deviceId', async () => {
      await clearDb(app);

      const { login, password } = await createUser(app);
      const cookies = await loginAndGetCookies(app, { login, password });

      const nonExistentDeviceId = '00000000-0000-0000-0000-000000000000';

      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}/${nonExistentDeviceId}`)
        .set('Cookie', cookies)
        .expect(HttpStatus.NotFound);
    });
  });

  describe('✅ should delete specified device session successfully', () => {
    it('should delete own device session and preserve others', async () => {
      await clearDb(app);

      const { login, password } = await createUser(app);

      // Логинимся с нескольких устройств
      const cookies1 = await loginAndGetCookies(app, { login, password }, { userAgent: 'device-1' });
      const cookies2 = await loginAndGetCookies(app, { login, password }, { userAgent: 'device-2' });
      const cookies3 = await loginAndGetCookies(app, { login, password }, { userAgent: 'device-3' });

      // Получаем deviceId первой сессии
      const refreshToken1 = extractCookie(cookies1, 'refreshToken');
      const payload1 = jwtService.decodeToken(refreshToken1) as any;
      const deviceId1 = payload1.deviceId;

      // Удаляем первую сессию
      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}/${deviceId1}`)
        .set('Cookie', cookies1)
        .expect(HttpStatus.NoContent);

      // Проверяем, что первая сессия удалена (refresh token больше не работает)
      await request(app)
        .post('/auth/refresh-token')
        .set('Cookie', cookies1)
        .expect(HttpStatus.Unauthorized);

      // Проверяем, что вторая сессия всё ещё активна
      await request(app)
        .post('/auth/refresh-token')
        .set('Cookie', cookies2)
        .expect(HttpStatus.Ok);

      // Проверяем, что третья сессия тоже активна
      await request(app)
        .post('/auth/refresh-token')
        .set('Cookie', cookies3)
        .expect(HttpStatus.Ok);
    });
  });

});