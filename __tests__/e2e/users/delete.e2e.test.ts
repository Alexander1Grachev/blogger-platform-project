import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { clearDb } from '../../utils/clear-db';
import { getTestApp } from '../../setup/start-test-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createUser } from '../../utils/users/create-user';
import { USERS_PATH } from '../../../src/core/paths/paths';

describe('DELETE users', () => {
  const app = getTestApp();
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('✅ should delete user with valid auth', async () => {
    const { user } = await createUser(app);
    const userId = user.id;

    await request(app)
      .delete(`${USERS_PATH}/${userId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${USERS_PATH}/${userId}`)
      .set('Authorization', adminToken) 
      .expect(HttpStatus.NotFound);
  });
});