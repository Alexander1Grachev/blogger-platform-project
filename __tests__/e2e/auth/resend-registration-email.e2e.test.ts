import request from 'supertest';

import { HttpStatus } from "../../../src/core/consts/http-statuses";
import { AUTH_PATH } from "../../../src/core/paths/paths";
import { getTestApp } from "../../setup/start-test-app";
import { registerAndGetCode } from "../../utils/auth/register-and-get-code";
import { clearDb } from "../../utils/clear-db";
import { mockEmailService } from '../../utils/auth/mockEmailService';

describe('POST /api/auth/registration-email-resending', () => {
  const app = getTestApp();

  beforeAll(async () => {
    await clearDb(app);
    mockEmailService();
  })

  it('❌ should return 400 if email not found', async () => {
    const response = await request(app)
      .post(`${AUTH_PATH}/registration-email-resending`)
      .send({ email: 'notFound@example.com' })
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
          field: 'email', // проверяем реальный field
        }),
      ])
    );
  });

  it('❌ should return 400 if user already confirmed', async () => {
    const code = await registerAndGetCode(app, 'user2', 'example2@example.com');

    // подтверждаем пользователя первый раз
    await request(app)
      .post(`${AUTH_PATH}/registration-confirmation`)
      .send({ code })
      .expect(HttpStatus.NoContent);

    const response = await request(app)
      .post(`${AUTH_PATH}/registration-email-resending`)
      .send({ email: 'example2@example.com' })
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
          field: 'email', // поле ошибки реально email
        }),
      ])
    );
  });

  it('✅ should resend confirmation email if user not confirmed', async () => {
    const email = 'example@example.com';

    // создаём пользователя
    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        login: 'user3',
        password: 'correctPass1',
        email,
      })
      .expect(HttpStatus.NoContent);

    const firstCode = expect.getState().code;
    expect(firstCode).toBeDefined();

    // повторная отправка письма
    await request(app)
      .post(`${AUTH_PATH}/registration-email-resending`)
      .send({ email })
      .expect(HttpStatus.NoContent);

    const secondCode = expect.getState().code;
    expect(secondCode).toBeDefined();
    expect(secondCode).not.toBe(firstCode); // новый код должен отличаться
  });
});