import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app";
import { clearDb } from "../../utils/clear-db";
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { AUTH_PATH } from '../../../src/core/paths/paths';
import { mockEmailService } from '../../utils/auth/mockEmailService';
import { generateUserData } from '../../utils/auth/test-data';



describe('POST /auth/registration', () => {
  const app = getTestApp();

  beforeAll(async () => {
    await clearDb(app);
    mockEmailService();
  });

  it('❌ should return 400 if body is invalid', async () => {
    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({})
      .expect(HttpStatus.BadRequest);
  });

  it('❌ should return 400 if EMAIL already exists and confirmed', async () => {
    // создаём пользователя
    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        ...generateUserData(),
        email: 'example@example.com'
      })
      .expect(HttpStatus.NoContent);

    // пытаемся создать с тем же email
    const response = await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        ...generateUserData(),
        email: 'example@example.com'
      })
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
          field: 'email',
        }),
      ])
    );
  });

  it('❌ should return 400 if LOGIN already exists', async () => {
    // создаём пользователя
    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        ...generateUserData(),
        login: 'userLog3',

      })
      .expect(HttpStatus.NoContent);

    // пытаемся создать с тем же логином
    const response = await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        ...generateUserData(),
        login: 'userLog3',

      })
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
          field: 'login',
        }),
      ])
    );
  });


  it('✅ should register user and send confirmation email (204)', async () => {
    await clearDb(app); // сбрасываем лимит и все сессии

    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        ...generateUserData()
      })
      .expect(HttpStatus.NoContent);

    const code = expect.getState().code; // вернёт undefined в случае провала 
    expect(code).toBeDefined(); // проверил на undefined  
  });


  it('❌ should return 429 after too many registration attempts', async () => {
    // 
    await clearDb(app); // сбрасываем лимит и все сессии
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post(`${AUTH_PATH}/registration`)
        .send({})
        .expect(HttpStatus.BadRequest);
    }
    // 6-я попытка -- 429
    await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({})
      .expect(HttpStatus.TooManyRequests);
  });

})