import { getTestApp } from "../../setup/start-test-app";
import request from 'supertest';
import { clearDb } from "../../utils/clear-db";
import { createUser } from "../../utils/users/create-user";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/consts/http-statuses";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../../../src/core/consts/pagination-and-sorting.default";



describe('READ user', () => {
  const app = getTestApp();
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('❌ should return 404 if user not found', async () => {
    await request(app)
      .get(`${USERS_PATH}/68dd420a59b32c41bb039999`)
      .expect(HttpStatus.NotFound);
  });

  it('✅ should return users list with pagination and support filters', async () => {

    // создаём 2 разных пользователя
    const user1 = await createUser(app);
    const user2 = await createUser(app);

    const resAll = await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(resAll.body.items).toHaveLength(2);
    expect(resAll.body.totalCount).toBe(2);
    expect(resAll.body.page).toBe(DEFAULT_PAGE_NUMBER);
    expect(resAll.body.pageSize).toBe(DEFAULT_PAGE_SIZE);
    expect(resAll.body.pagesCount).toBe(Math.ceil(2 / DEFAULT_PAGE_SIZE));

    // фильтр по login
    const resLogin = await request(app)
      .get(USERS_PATH)
      .query({ searchLoginTerm: user1.login })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(resLogin.body.items).toHaveLength(1);
    expect(resLogin.body.items[0].login).toBe(user1.login);

    // фильтр по email
    const resEmail = await request(app)
      .get(USERS_PATH)
      .query({ searchEmailTerm: user2.email })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(resEmail.body.items).toHaveLength(1);
    expect(resEmail.body.items[0].email).toBe(user2.email);
  });
});