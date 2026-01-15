import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app";
import { clearDb } from "../../utils/clear-db";
import { createUser } from "../../utils/users/create-user";
import { AUTH_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from '../../../src/core/consts/http-statuses';


describe('CREATE user session',  () => {
  const app = getTestApp();

  beforeAll(async () => {
    await clearDb(app);
    await createUser(app);
  });

  it('❌ should return 401 with wrong password', async () => {
    const res = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: 'nonexistent',
        password: 'wrongpassword'
      })
      .expect(HttpStatus.Unauthorized)

    expect(res.body).toEqual({});
  });

  it('✅ should login with correct credentials (login)', async () => {
    const res = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: 'NewUser2',
        password: '12345u'
      })
      .expect(HttpStatus.NoContent);

    expect(res.body).toEqual({});
  });

  it('✅ should login with correct credentials (email)', async () => {
    const res = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: 'new2user@mail.com',
        password: '12345u'
      })
      .expect(HttpStatus.NoContent);

    expect(res.body).toEqual({});

  });

})