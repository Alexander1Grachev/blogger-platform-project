
import { Request, Response } from 'express'
import { EmailInputDto } from '../../application/dtos/email-input.model';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { emailService } from '../../application/auth-email.service ';

export async function registrationEmailResendingHandler(
    req: Request<{}, {}, EmailInputDto>,
    res: Response
) {
    try {
        await emailService.resendEmail(req.body.email);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}