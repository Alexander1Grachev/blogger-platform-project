import { UserInputDto } from '../../../src/users/routers/input/user-input-dto';
import request from 'supertest';
import { Express } from 'express';
import { USERS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/consts/http-statuses";



export async function createUser(
    app: Express,
) {
    const unique = crypto.randomUUID().replace(/-/g, '').slice(0, 8);

    const login = `u${unique}`;       // 7 символов
    const password = `pass${unique}`;
    const email = `${unique}@test.com`;

    const correctTestUserAttributes: UserInputDto = {
        login: login,
        password: password,
        email: email,
    }


    const res = await request(app)
        .post(USERS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(correctTestUserAttributes)
        .expect(HttpStatus.Created);

    return {
        user: res.body,
        login,
        password,
        email,
    };
}


