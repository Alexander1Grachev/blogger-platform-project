import request from 'supertest';

import { HttpStatus } from "../../../src/core/consts/http-statuses";
import { getTestApp } from '../../setup/start-test-app';
import { clearDb } from "../../utils/clear-db";
import { mockEmailService } from '../../utils/auth/mockEmailService';
import { AUTH_PATH } from '../../../src/core/paths/paths';


describe(
  'Password recovery via Email confirmation.Email should be sent with RecoveryCode inside'
  , () => {
    const app = getTestApp();

    beforeAll(async () => {
      await clearDb(app);
      mockEmailService();
    });
    
    it('❌ should return 400 if  invalid email', async () => {
      await request(app)
        .post(`${AUTH_PATH}/password-recovery`)
        .send({
          email: 'exampleexample.com'
        })
        .expect(HttpStatus.BadRequest)
    });

    it('✅ should send password recovery on email (Even if current email is not registered )', async () => {
      await request(app)
        .post(`${AUTH_PATH}/registration`)
        .send({
          login: 'user3',
          password: 'correctPass1',
          email: 'example@example.com'
        })
        .expect(HttpStatus.NoContent);

        await request(app)
        .post(`${AUTH_PATH}/password-recovery`)
        .send({
          email: 'example@example.com'
        })
        .expect(HttpStatus.NoContent);

        const recoveryCode = expect.getState().recoveryCode;
      expect(recoveryCode).toBeDefined();
    })

    it('❌ should return 429 after too many email-resending attempts', async () => {
      await clearDb(app);

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post(`${AUTH_PATH}/password-recovery`)
          .send({ email: 'example2@example.com' })
          .expect(HttpStatus.NoContent);
      }
      // 6-я попытка -- 429
      await request(app)
        .post(`${AUTH_PATH}/password-recovery`)
        .send({ email: 'example2@example.com' })
        .expect(HttpStatus.TooManyRequests);
    });
  })

