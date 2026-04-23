import { UserInputDto } from "../../../src/users/routers/input/user-input-dto";


export function getUserDto(): UserInputDto {
  const randomNum = Math.floor(Math.random() * 10000);
  return {
    login: `u${randomNum}`, // короткий логин 2-5 символов
    password: '123456',
    email: `test${randomNum}@mail.com`,
  };
}