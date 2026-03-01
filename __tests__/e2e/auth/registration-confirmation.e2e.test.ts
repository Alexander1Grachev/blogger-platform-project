import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app";
import { clearDb } from "../../utils/clear-db";

import { mockEmailService } from '../../utils/auth/mockEmailService';
import { expireConfirmationCode } from '../../utils/auth/expire-Conf-code';

import { AUTH_PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { registerAndGetCode } from '../../utils/auth/register-and-get-code';


describe('POST /api/auth/registration-confirmation', () => {
  const app = getTestApp();

  beforeAll(async () => {
    await clearDb(app);
    mockEmailService(); 
  })

  it('❌ should return 400 if body is invalid', async () => {
    const response = await request(app)
      .post(`${AUTH_PATH}/registration-confirmation`)
      .send({})
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
          field: 'code',
        }),
      ])
    );
  });

  it('❌ should return 400 if code expired', async () => {
    const code = await registerAndGetCode(
      app,
      'user1',
      'example1@example.com'
    );

    await expireConfirmationCode(code);

    const response = await request(app)
      .post(`${AUTH_PATH}/registration-confirmation`)
      .send({ code })
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
          field: 'emailConfirmation',
        }),
      ])
    );
  });

  it('❌ should return 400 if code already confirmed', async () => {
    const code = await registerAndGetCode(
      app,
      'user2',
      'example2@example.com'
    );

    // первый раз подтверждаем
    await request(app)
      .post(`${AUTH_PATH}/registration-confirmation`)
      .send({ code })
      .expect(HttpStatus.NoContent);

    // повторная попытка
    const response = await request(app)
      .post(`${AUTH_PATH}/registration-confirmation`)
      .send({ code })
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
          field: 'emailConfirmation',
        }),
      ])
    );
  });

  it('✅ should confirm registration with valid code (204)', async () => {
    const code = await registerAndGetCode(
      app,
      'user3',
      'example3@example.com'
    );

    await request(app)
      .post(`${AUTH_PATH}/registration-confirmation`)
      .send({ code })
      .expect(HttpStatus.NoContent);
  });
});