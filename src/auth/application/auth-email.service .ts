import { usersQueryRepository } from "../../users/repositories/users.query.repository";
import { nodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/emails.templates";
import crypto from 'crypto';
import { BadRequestError } from "../../core/errors/bad-request.error";
import { usersRepository } from "../../users/repositories/users.repository";
import { addHours } from 'date-fns';

export const emailService = {
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
    const newConfirmationCode = crypto.randomUUID();
    await usersRepository.updateEmailConfirmationCode(
      user._id,
      newConfirmationCode,
      addHours(new Date(), 1)
    );
    const html = emailExamples.registrationEmail(newConfirmationCode, user.login);
    nodemailerService.sendEmail(user.email, 'Registration', html);
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
  },
};

