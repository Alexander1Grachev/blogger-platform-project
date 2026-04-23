import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app";
import { clearDb } from "../../utils/clear-db";
import { createUser } from "../../utils/users/create-user";
import { AUTH_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from '../../../src/core/consts/http-statuses';


describe('CREATE user session', () => {
  const app = getTestApp();


  beforeAll(async () => {
    await clearDb(app);
  });

  it('❌ should return 400 with incorrect values', async () => {

    const res = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: '',
        password: ''
      })
      .expect(HttpStatus.BadRequest)

    expect(res.body).toHaveProperty('errorsMessages');
    expect(Array.isArray(res.body.errorsMessages)).toBe(true);
    expect(res.body.errorsMessages.length).toBeGreaterThan(0);

    const fields = res.body.errorsMessages.map((e: any) => e.field);
    expect(fields).toContain('loginOrEmail');
    expect(fields).toContain('password');
  });


  it('✅ should login with correct credentials (login)', async () => {
    const { login, password } = await createUser(app)

    const res = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: login,
        password: password,
      })
      .expect(HttpStatus.Ok);
    // 1. проверяем accessToken
    expect(res.body).toHaveProperty('accessToken');
    expect(typeof res.body.accessToken).toBe("string");
    expect(res.body.accessToken.length).toBeGreaterThan(0);
    // 2. проверяем refreshToken
    const cookies = res.header['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('refreshToken');
  });

  it('✅ should login with correct credentials (email)', async () => {
    const { email, password } = await createUser(app)

    const res = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: email,
        password: password,
      })
      .expect(HttpStatus.Ok);

    // 1. проверяем accessToken
    expect(res.body).toHaveProperty('accessToken');
    expect(typeof res.body.accessToken).toBe("string");
    expect(res.body.accessToken.length).toBeGreaterThan(0);
    // 2. проверяем refreshToken
    const cookies = res.header['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('refreshToken');
  });

  it('❌ should return 429 after too many login attempts', async () => {
    // ❌ should return 401 with wrong password or login
    await clearDb(app); // сбрасываем лимит и все сессии
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post(`${AUTH_PATH}/login`)
        .send({
          loginOrEmail: 'wrong',
          password: 'wrong',
        })
        .expect(HttpStatus.Unauthorized);
    }
    // 6-я попытка -- 429
    await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: 'wrong',
        password: 'wrong',
      })
      .expect(HttpStatus.TooManyRequests);
  });


})

