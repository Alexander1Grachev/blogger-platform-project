import request from 'supertest';

import { Express } from 'express';
import { UserInputDto } from '../../src/users/application/dtos/user-input-dto';
import { HttpStatus } from '../../src/core/consts/http-statuses';
import { AUTH_PATH, USERS_PATH } from '../../src/core/paths/paths';
import { generateBasicAuthToken } from './generate-admin-auth-token';


export async function createUserAndLogin(
  app: Express,
  {
    login,
    password,
    email,
  }: UserInputDto
): Promise<{ accessToken: string }> {
  const adminToken = generateBasicAuthToken()
  await request(app)
    .post(USERS_PATH)
    .set('Authorization', adminToken)
    .send({ login, password, email })
    .expect(HttpStatus.Created);

  const loginRes = await request(app)
    .post(`${AUTH_PATH}/login`)
    .send({ loginOrEmail: login, password })
    .expect(HttpStatus.Ok);
  const { accessToken } = loginRes.body;
  if (!accessToken) {
    throw new Error('Login did not return accessToken');
  }
  return { accessToken };
};
