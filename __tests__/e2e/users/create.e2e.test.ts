import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { UserInputDto } from '../../../src/users/routers/input/user-input-dto';
import { USERS_PATH } from '../../../src/core/paths/paths';
import { createUser } from '../../utils/users/create-user';
import { getTestApp } from '../../setup/start-test-app';
import { userCollection } from '../../../src/infrastructure/db/mongo.db';


describe('CREATE user check', () => {
  const app = getTestApp();

  const adminToken = generateBasicAuthToken();
  beforeAll(async () => {
    await clearDb(app);
  });
  const correctTestUserAttributes: UserInputDto = {
    login: 'NewUser1',
    password: '1234u',
    email: 'new1user@mail.com',
  }
  it('❌ should not create user without auth', async () => {
    await request(app)
      .post(USERS_PATH)
      .send(correctTestUserAttributes)
      .expect(HttpStatus.Unauthorized);
  });
  it('❌ should not create user with wrong auth', async () => {
    await request(app)
      .post(USERS_PATH)
      .set('Authorization',
        'Basic' + Buffer.from('wrong:creds').toString('base64'),
      )
      .send(correctTestUserAttributes)
      .expect(HttpStatus.Unauthorized);
  })
  it('❌ should not create user with invalid attributes', async () => {
    const invalidTestUserAttributes: UserInputDto = {
      login: '   ',
      password: 'a'.repeat(600),
      email: 'new1usermail.com',
    }
    const invalidResponse = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(invalidTestUserAttributes)
      .expect(HttpStatus.BadRequest)

    expect(invalidResponse.body.errorsMessages).toHaveLength(3);

    const userList = await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok)
    expect(userList.body.items).toHaveLength(0)
    expect(userList.body.totalCount).toBe(0);
  })

  it('❌ should not create user with same attributes', async () => {
    const userData = {
      login: 'uniqueuser',
      password: '123456',
      email: 'unique@mail.com'
    }

    // <-- вот сюда
    console.log('🧹 USERS IN DB BEFORE CREATE:', await userCollection.find().toArray());

    // 1. Создаем первого
    const firstResponse = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(userData)
      .expect(HttpStatus.Created);

    // 2. Пытаемся создать второго с теми же данными
    const secondResponse = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(userData) // ← те же данные!
      .expect(HttpStatus.BadRequest); // ← ожидаем 400!

    // 3. Проверяем ошибку
    expect(secondResponse.body.errorsMessages[0].field).toBe('login');

    const res = await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok)
    console.log('GET /users response body:', res.body);

    expect(res.body.items).toHaveLength(1);
    expect(res.body.totalCount).toBe(1);
  });

  it('✅ should create user with valid data & auth', async () => {
    const { user, login, email } = await createUser(app);

    expect(user).toEqual({
      id: expect.any(String),
      login: login,
      email: email,
      createdAt: expect.any(String),
    });
  });
})