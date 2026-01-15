import { UserInputDto } from "../../../src/users/application/dtos/user-input-dto"
import request from 'supertest';
import { Express } from 'express';
import { USERS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/consts/http-statuses";
import { UserViewModel } from "../../../src/users/application/dtos/user-view-model";



export async function createUser(
    app: Express,
): Promise<UserViewModel> {
    const correctTestUserAttributes: UserInputDto = {
        login: 'NewUser2',
        password: '12345u',
        email: 'new2user@mail.com',
    }
    const createUserResponse = await request(app)
        .post(USERS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(correctTestUserAttributes)
        .expect(HttpStatus.Created);

    return createUserResponse.body;
}


