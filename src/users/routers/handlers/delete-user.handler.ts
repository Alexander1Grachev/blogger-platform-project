import { Request, Response } from 'express';
import { usersService } from '../../application/users.service';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deleteUserHandler(
  req: Request<{ id: string }>,
  res: Response<void>,
) {
  try {
    const userId = req.params.id;
    await usersService.delete(userId);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};