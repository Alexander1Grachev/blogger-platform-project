
import { Request, Response } from 'express'
import { EmailInputDto } from '../input/email-input.model';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { EmailService } from '../../application/auth-email.service ';


export class RegistrationEmailResendingController {
    constructor(private readonly emailService: EmailService) { };

    handle = async (
        req: Request<{}, {}, EmailInputDto>,
        res: Response
    ) => {
        try {
            await this.emailService.resendEmail(req.body.email);
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }
}