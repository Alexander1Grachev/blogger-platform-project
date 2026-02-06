import { WithId } from "mongodb";
import { Result } from "../../core/result/result.type";
import { IUserDB } from "../../users/models/user.db.interface";
import { usersQueryRepository } from "../../users/repositories/users.query.repository";
import { bcryptService } from "../adapters/bcrypt.service";
import { ResultStatus } from "../../core/result/resultCode";
import { jwtService } from "../adapters/jwt.service";
import { MeView } from "../../users/models/me.view.interface";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { UnauthorizedError } from "../../core/errors/unauthorized.error";


export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await usersQueryRepository.findForAuth(loginOrEmail);
    if (!user) {
      throw new UnauthorizedError('Wrong credentials');
    }

    const isPasswordValid = await bcryptService.checkPassword(password, user.passwordHash); 
    if (!isPasswordValid) {
      throw new UnauthorizedError('Wrong credentials')
    }
    const accessToken = await jwtService.createToken(user._id.toString())
    return { accessToken }
  },


  async getMeView(id: string): Promise<MeView> {
    const user = await usersQueryRepository.findByIdOrFail(id);

    return {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    }
  },
};

