import { UsersQueryRepository } from "../../users/repositories/users.query.repository";
import { NodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/emails.templates";
import crypto from 'crypto';
import { BadRequestError } from "../../core/errors/bad-request.error";
import { UsersRepository } from "../../users/repositories/users.repository";
import { addHours } from 'date-fns';
import { injectable, inject } from "inversify";


injectable
export class EmailService {
  constructor(
    @inject(UsersQueryRepository) private readonly usersQueryRepository: UsersQueryRepository,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(NodemailerService) private readonly nodemailerService: NodemailerService,

  ) { }
  //---------------------------------

  async resendEmail(
    email: string,
  ): Promise<void> {
    const user = await this.usersQueryRepository.findForAuth(email);
    if (!user) {
      throw new BadRequestError('Invalid email', 'email');
    }
    if (user.emailConfirmation?.isConfirmed) {
      throw new BadRequestError('Email already confirmed', 'email');
    }
    const newConfirmationCode = crypto.randomUUID();
    await this.usersRepository.updateEmailConfirmationCode(
      user._id,
      newConfirmationCode,
      addHours(new Date(), 1)
    );
    const html = emailExamples.registrationEmail(newConfirmationCode, user.login);
    this.nodemailerService.sendEmail(user.email, 'Registration', html);
  }


  async confirmEmail(
    confCode: string,
  ): Promise<boolean> {
    const user = await this.usersQueryRepository.findByConfirmationCode(confCode);
    if (!user) {
      throw new BadRequestError('Invalid confirmation code', 'code');
    }
    if (user.emailConfirmation?.isConfirmed) {
      throw new BadRequestError('Email already confirmed', 'code');
    }
    if (!user.emailConfirmation || user.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestError('Email confirmation out of time', 'code');
    }
    await this.usersRepository.confirmEmail(
      user._id,
    )
    return true
  }

  async sendPasswordRecovery(
    email: string,
  ): Promise<void> {
    const user = await this.usersQueryRepository.findForAuth(email);
    if (!user) return;
    const newConfirmationCode = crypto.randomUUID();
    await this.usersRepository.updatePasswordRecoveryCode(
      user._id,
      newConfirmationCode,
      addHours(new Date(), 1)
    );
    const html = emailExamples.recoveryPasswordEmail(newConfirmationCode);
    this.nodemailerService.sendEmail(
      email,
      'Password recovery',
      html
    )
  }
};

