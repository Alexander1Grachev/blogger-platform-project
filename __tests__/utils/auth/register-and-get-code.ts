
import request from 'supertest';
import { Express } from 'express';

import { AUTH_PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/consts/http-statuses';

export async function registerAndGetCode(
    app: Express,
    login: string,
    email: string,
    password = "correctPass1"
) {
    await request(app)
        .post(`${AUTH_PATH}/registration`)
        .send({ login, password, email })
        .expect(HttpStatus.NoContent);

    const code = expect.getState().code;
    return code;
}