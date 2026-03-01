
import { Request, Response } from 'express'
import { EmailInputDto } from '../../application/dtos/email-input.model';
import { authService } from '../../application/auth.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/consts/http-statuses';

export async function registrationEmailResendingHandler(
    req: Request<{}, {}, EmailInputDto>,
    res: Response
) {
    try {
        await authService.resendEmail(req.body.email);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}