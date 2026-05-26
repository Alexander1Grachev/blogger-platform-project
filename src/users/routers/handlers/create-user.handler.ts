import { UserInputDto } from "../input/user-input-dto";
import { Response, Request } from 'express'
import { UsersService } from "../../application/users.service";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { mapToUserOutput } from "../../application/mappers/map-to-user-output.util";
import { injectable, inject } from "inversify";


@injectable()
export class CreateUserController {
  constructor(@inject(UsersService)
  private readonly usersService: UsersService) { };
  handle = async (
    req: Request<{}, {}, UserInputDto>,
    res: Response,
  ) => {
    try {
      const userId = await this.usersService.create(req.body);
      console.log('CREATED USER ID:', userId, typeof userId);

      const createdUser = await this.usersService.findById(userId);
      const userOutput = mapToUserOutput(createdUser)
      res.status(HttpStatus.Created).send(userOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}