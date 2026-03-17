import { usersQueryRepository } from "../../users/repositories/users.query.repository";
import { bcryptService } from "../adapters/bcrypt.service";
import { jwtService } from "../adapters/jwt.service";
import { MeView } from "../../users/application/dtos/me.view.interface";
import { UnauthorizedError } from "../../core/errors/unauthorized.error";
import { UserInputDto } from "../../users/application/dtos/user-input-dto";
import { nodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/emails.templates";
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from "../../core/errors/bad-request.error";
import { IUserDB } from "../../users/models/user.db.interface";
import { usersRepository } from "../../users/repositories/users.repository";
import { addHours } from 'date-fns';
import { refreshTokenRepository } from "../repositories/refreshToken.repository";
import { appConfig } from "../../core/config/config";

export const authService = {

  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await usersQueryRepository.findForAuth(loginOrEmail);
    if (!user) {
      throw new UnauthorizedError('Wrong credentials');
    }
    const isPasswordValid = await bcryptService.checkPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Wrong credentials')
    }
    const accessToken = jwtService.createAccessToken(user._id.toString());
    const refreshToken = jwtService.createRefreshToken(user._id.toString());

    await refreshTokenRepository.createRefreshToken({
      refreshToken: refreshToken,
      userId: user._id.toString(),
      expiresAt: new Date(Date.now() + Number(appConfig.RT_TIME) * 1000),
      isRevoked: false,
    });

    return { accessToken, refreshToken }
  },


  async getMeView(id: string): Promise<MeView> {
    const user = await usersQueryRepository.findByIdOrFail(id);

    return {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    }
  },

  async register(dto: UserInputDto): Promise<void> {
    const confirmationCode = uuidv4();
    const passwordHash = await bcryptService.generateHash(dto.password)
    const newUser: IUserDB = {
      login: dto.login,
      email: dto.email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode,
        expirationDate: addHours(new Date(), 1),
        isConfirmed: false,
      },
    };
    const existingUser = await usersQueryRepository.findForRegistration(newUser.login, newUser.email);

    if (existingUser) {
      if (existingUser.login === dto.login) {
        throw new BadRequestError('Login is already in use', 'login');
      }
      if (existingUser.email === dto.email) {
        throw new BadRequestError('Email is already in use', 'email');
      }
    }
    const userId = await usersRepository.create(newUser)
    const user = await usersQueryRepository.findByIdOrFail(userId);

    const html = emailExamples.registrationEmail(
      user.emailConfirmation!.confirmationCode,
      user.login
    );
    await nodemailerService.sendEmail(
      user.email,
      'Registration',
      html
    );
  },
};

