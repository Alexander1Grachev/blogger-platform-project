import request from 'supertest';
import { Express } from 'express';
import { AUTH_PATH } from '../../../src/core/paths/paths';


export async function loginAndGetCookies(
  app: Express
) {
  const res = await request(app)
    .post(`${AUTH_PATH}/login`)
    .send({
      loginOrEmail: 'NewUser2',
      password: '12345u',
    });

  const setCookie = res.header['set-cookie'];
  const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

  return cookiesArray
    .map((c: string) => c.split(';')[0])
   // .join('; ')
}