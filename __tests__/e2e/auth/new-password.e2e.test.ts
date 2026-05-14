import request from 'supertest';
import { HttpStatus } from "../../../src/core/consts/http-statuses";
import { getTestApp } from '../../setup/start-test-app';
import { clearDb } from "../../utils/clear-db";
import { mockEmailService } from '../../utils/auth/mockEmailService';
import { AUTH_PATH } from '../../../src/core/paths/paths';

describe('Password recovery confirmation', () => {
  const app = getTestApp();

  beforeAll(async () => {
    mockEmailService();
  })

  beforeEach(async () => {
    await clearDb(app);
    
  })


  // тестим мидлвар валидатор
  it('❌ should return 400 if password is invalid', async () => {
    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        login: 'user1',
        password: 'correctPass1',
        email: 'example1@example.com'
      })
      .expect(HttpStatus.NoContent);

    await request(app)
      .post(`${AUTH_PATH}/password-recovery`)
      .send({
        email: 'example1@example.com'
      })
      .expect(HttpStatus.NoContent);

    const recoveryCode = expect.getState().recoveryCode;

    expect(recoveryCode).toBeDefined();

    await request(app)
      .post(`${AUTH_PATH}/new-password`)
      .send({
        newPassword: '123',
        recoveryCode
      })
      .expect(HttpStatus.BadRequest);
  });

  it('❌ should return 400 if recovery code is invalid', async () => {

    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        login: 'user1',
        password: 'correctPass1',
        email: 'example1@example.com'
      })
      .expect(HttpStatus.NoContent);

    await request(app)
      .post(`${AUTH_PATH}/password-recovery`)
      .send({
        email: 'example1@example.com'
      })
      .expect(HttpStatus.NoContent);

    await request(app)
      .post(`${AUTH_PATH}/new-password`)
      .send({
        newPassword: 'ValidPass123',
        recoveryCode: 'wrong-recovery-code'
      })
      .expect(HttpStatus.BadRequest);
  });
  // тестим бмзнес локигу
  it('❌  should return 400 if recovery code already used', async () => {

    // 1 
    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        login: 'user1',
        password: 'correctPass1',
        email: 'example1@example.com'
      })
      .expect(HttpStatus.NoContent);

    // 2
    await request(app)
      .post(`${AUTH_PATH}/password-recovery`)
      .send({
        email: 'example1@example.com'
      })
      .expect(HttpStatus.NoContent);

    const recoveryCode = expect.getState().recoveryCode;
    expect(recoveryCode).toBeDefined();
    // 3
    await request(app)
      .post(`${AUTH_PATH}/new-password`)
      .send({
        newPassword: "NewPass00",
        recoveryCode: recoveryCode
      })
      .expect(HttpStatus.NoContent)
    // 4 проверка бизнес логике защита от повтороного использования 
    await request(app)
      .post(`${AUTH_PATH}/new-password`)
      .send({
        newPassword: "NewPass1",
        recoveryCode: recoveryCode
      })
      .expect(HttpStatus.BadRequest)
  });

  it('✅ should confirm password changes if code and new password are valid', async () => {

    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        login: 'user2',
        password: 'correctPass2',
        email: 'example2@example.com'
      })
      .expect(HttpStatus.NoContent);

    await request(app)
      .post(`${AUTH_PATH}/password-recovery`)
      .send({
        email: 'example2@example.com'
      })
      .expect(HttpStatus.NoContent);

    const recoveryCode = expect.getState().recoveryCode;
    expect(recoveryCode).toBeDefined();

    await request(app)
      .post(`${AUTH_PATH}/new-password`)
      .send({
        newPassword: "NewPass2",
        recoveryCode: recoveryCode
      })
      .expect(HttpStatus.NoContent);
    // вход под новым паролем 
    await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: 'example2@example.com',
        password: 'NewPass2'
      })
      .expect(HttpStatus.Ok);
    // вход под старыми данными 
    await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: 'example2@example.com',
        password: 'correctPass2'
      })
      .expect(HttpStatus.Unauthorized);
  })

  it('❌ should return 429 after too many attempts', async () => {

    for (let i = 0; i < 5; i++) {
      await request(app)
        .post(`${AUTH_PATH}/new-password`)
        .send({
          newPassword: '123456',
          recoveryCode: 'invalid-code'
        })
        .expect(HttpStatus.BadRequest);
    }
    // 6-я попытка -- 429
    await request(app)
      .post(`${AUTH_PATH}/new-password`)
      .send({
        newPassword: '123456',
        recoveryCode: 'invalid-code'
      })
      .expect(HttpStatus.TooManyRequests);
  });
})