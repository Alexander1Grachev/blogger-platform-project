import { UsersQueryRepository } from "../../users/repositories/users.query.repository";
import { BcryptService } from "../adapters/bcrypt.service";
import { JwtService } from "../adapters/jwt.service";
import { MeView } from "../../users/application/output/me.view.interface";
import { UnauthorizedError } from "../../core/errors/unauthorized.error";
import { UserInputDto } from "../../users/routers/input/user-input-dto";
import { NodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/emails.templates";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { IUser, UserModel } from "../../users/repositories/models/user.model";
import { UsersRepository } from "../../users/repositories/users.repository";
import { addHours } from 'date-fns';
import { SessionService } from "../../security-devices/application/session.service";
import crypto from 'crypto';
import { SessionRepository } from "../../security-devices/repositories/session.repository";
import { injectable, inject } from "inversify";
import { SessionQueryRepository } from "../../security-devices/repositories/session..query.repository";


@injectable()
export class AuthService {
  constructor(
    @inject(BcryptService) private readonly bcryptService: BcryptService,
    @inject(JwtService) private readonly jwtService: JwtService,
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(NodemailerService) private readonly nodemailerService: NodemailerService,

    @inject(SessionQueryRepository) private readonly sessionQueryRepository: SessionQueryRepository,
    @inject(SessionRepository) private readonly sessionRepository: SessionRepository,
    @inject(UsersQueryRepository) private readonly usersQueryRepository: UsersQueryRepository,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) { }
  //-----------------------
  async sessionValidation(
    deviceId: string,
    iat: number,
  ): Promise<void> {
    const session = await this.sessionQueryRepository.findSessionByDeviceIdAuth(deviceId);

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

    const existingUser = await this.usersQueryRepository.findForRegistration(dto.login, dto.email);
    if (existingUser) {
      if (existingUser.login === dto.login) {
        throw new BadRequestError('Login is already in use', 'login');
      }
      if (existingUser.email === dto.email) {
        throw new BadRequestError('Email is already in use', 'email');
      }
    }

    const newUser = new UserModel;
    newUser.login = dto.login
    newUser.email = dto.email
    newUser.passwordHash = passwordHash
    newUser.createdAt = new Date()
    newUser.emailConfirmation = {
      confirmationCode: confirmationCode,
      expirationDate: addHours(new Date(), 1),
      isConfirmed: false
    };
    const userId = await this.usersRepository.create(newUser)
    const user = await this.usersQueryRepository.findByIdOrFail(userId);

    const html = emailExamples.registrationEmail(
      user.emailConfirmation!.confirmationCode,
      user.login
    );
    this.nodemailerService.sendEmail(
      user.email,
      'Registration',
      html
    );
  }

  async passwordRecovery(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    const user = await this.usersQueryRepository.findByRecoveryCode(recoveryCode);
    if (!user) {
      throw new BadRequestError('Invalid recovery code', 'recoveryCode');
    }
    if (user.passwordRecovery!.expirationDate < new Date()) {
      throw new BadRequestError('Recovery code expired', 'recoveryCode');
    }
    const passwordHash = await this.bcryptService.generateHash(newPassword);
    await this.usersRepository.confirmPasswordRecovery(
      user._id,
      passwordHash
    );
  }
};

