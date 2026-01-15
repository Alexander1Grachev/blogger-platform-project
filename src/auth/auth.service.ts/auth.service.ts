import { usersQueryRepository } from "../../users/repositories/users.query.repository";
import { bcryptService } from "./bcrypt.service";


export const authService = {
  /*
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<{ accessToken: string } | null> {
    const isCorrectCredentials = await this.checkUserCredentials(
      loginOrEmail,
      password,
    );

    if (!isCorrectCredentials) {
      return null;
    }

    return { accessToken: "token" };
  },
  */
  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<boolean> {
    const user = await usersQueryRepository.findForAuth(loginOrEmail);
    if (!user) return false;
    return bcryptService.checkPassword(password, user.passwordHash);
  }
}

