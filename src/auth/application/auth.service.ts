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




  async resendEmail(
    email: string,
  ) {
    const user = await usersQueryRepository.findForAuth(email);
    if (!user) {
      throw new BadRequestError('Invalid email', 'email');
    }
    if (user.emailConfirmation?.isConfirmed) {
      throw new BadRequestError('Email already confirmed', 'email');
    }

    const newConfirmationCode = uuidv4();
    await usersRepository.updateEmailConfirmationCode(
      user._id,
      newConfirmationCode,
      addHours(new Date(), 1)
    );
    const html = emailExamples.registrationEmail(newConfirmationCode, user.login);
    await nodemailerService.sendEmail(user.email, 'Registration', html);
  },



  async confirmEmail(
    confCode: string,
  ) {
    const user = await usersQueryRepository.findByConfirmationCode(confCode);

    if (user.emailConfirmation?.isConfirmed) {
      throw new BadRequestError('Email already confirmed', 'code');
    }

    if (!user.emailConfirmation || user.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestError('Email confirmation out of time', 'code');
    }

    await usersRepository.confirmEmail(
      user._id,
    )

    return true
  }
};

