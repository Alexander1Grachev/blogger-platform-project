import request from 'supertest';
import { Express } from 'express';
import { AUTH_PATH } from '../../../src/core/paths/paths';

export async function loginAndGetCookies(
  app: Express,
  creds: { login: string; password: string },
  options?: { userAgent?: string },
) {

  const res = await request(app)
    .post(`${AUTH_PATH}/login`)
    .send({
      loginOrEmail: creds.login,
      password: creds.password
    })
    .set('User-Agent', options?.userAgent || 'default-Agent');

  const setCookie = res.header['set-cookie'];
  const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

  return cookiesArray
    .map((c: string) => c.split(';')[0])
  //.join('; ')
}