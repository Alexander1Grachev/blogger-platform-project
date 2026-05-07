import { Request, Response } from 'express';
import { UsersService } from '../../application/users.service';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';

export class DeleteUseController {
  constructor(private readonly usersService: UsersService) { };

  handle = async (
    req: Request<{ id: string }>,
    res: Response<void>,
  ) => {
    try {
      const userId = req.params.id;
      await this.usersService.delete(userId);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}