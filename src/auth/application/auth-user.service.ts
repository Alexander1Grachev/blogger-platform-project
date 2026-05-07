import { UsersQueryRepository } from "../../users/repositories/users.query.repository";
import { BcryptService } from "../adapters/bcrypt.service";
import { JwtService } from "../adapters/jwt.service";
import { MeView } from "../../users/application/output/me.view.interface";
import { UnauthorizedError } from "../../core/errors/unauthorized.error";
import { UserInputDto } from "../../users/routers/input/user-input-dto";
import { nodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/emails.templates";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { IUserDB } from "../../users/repositories/models/user.db.interface";
import { UsersRepository } from "../../users/repositories/users.repository";
import { addHours } from 'date-fns';
import { SessionService } from "../../security-devices/application/session.service";
import crypto from 'crypto';
import { SessionRepository } from "../../security-devices/repositories/session.repository";

export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,

    private readonly sessionRepository: SessionRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
  ) { }
  //-----------------------
  async sessionValidation(
    deviceId: string,
    iat: number,
  ): Promise<void> {
    const session = await this.sessionRepository.findSessionByDeviceIdAuth(deviceId);

    if (!session ||
      iat !== Math.floor(session.lastActiveAt.getTime() / 1000)
    ) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async loginUser(
    loginOrEmail: string,
    password: string,
    ip: string,
    deviceName: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // ищем полшьзователя 
    const user = await this.usersQueryRepository.findForAuth(loginOrEmail);
    if (!user) {
      throw new UnauthorizedError('Wrong credentials');
    }
    // проверяем пароль 
    const isPasswordValid = await this.bcryptService.checkPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Wrong credentials')
    }
    // создаем токены 
    const deviceId = crypto.randomUUID();

    const refreshToken = this.jwtService.createRefreshToken(user._id.toString(), deviceId);
    const payload = this.jwtService.decodeToken(refreshToken) as { iat: number; exp: number };
    const accessToken = this.jwtService.createAccessToken(user._id.toString());
    //создаем сессию 

    await this.sessionService.createSession(
      {
        userId: user._id,
        ip,
        deviceName,
        deviceId,
        iat: payload.iat,
        exp: payload.exp,
      });
    return { accessToken, refreshToken }
  }


  async getMeView(id: string): Promise<MeView> {
    const user = await this.usersQueryRepository.findByIdOrFail(id);

    return {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    }
  }

  async register(dto: UserInputDto): Promise<void> {
    const confirmationCode = crypto.randomUUID();
    const passwordHash = await this.bcryptService.generateHash(dto.password)
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
    const existingUser = await this.usersQueryRepository.findForRegistration(newUser.login, newUser.email);

    if (existingUser) {
      if (existingUser.login === dto.login) {
        throw new BadRequestError('Login is already in use', 'login');
      }
      if (existingUser.email === dto.email) {
        throw new BadRequestError('Email is already in use', 'email');
      }
    }
    const userId = await this.usersRepository.create(newUser)
    const user = await this.usersQueryRepository.findByIdOrFail(userId);

    const html = emailExamples.registrationEmail(
      user.emailConfirmation!.confirmationCode,
      user.login
    );
    nodemailerService.sendEmail(
      user.email,
      'Registration',
      html
    );
  }
};

