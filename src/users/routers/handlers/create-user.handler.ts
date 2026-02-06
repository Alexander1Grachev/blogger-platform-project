import { UserInputDto } from "../../application/dtos/user-input-dto";
import { Response, Request } from 'express'
import { usersService } from "../../application/users.service";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { mapToUserOutput } from "../../application/mappers/map-to-user-output.util";
export async function createUserHandler(
    req: Request<{}, {}, UserInputDto>,
    res: Response,
) {
    try {
        const userId = await usersService.create(req.body);
        console.log('CREATED USER ID:', userId, typeof userId);

        const createdUser = await usersService.findByIdOrFail(userId);
        const userOutput = mapToUserOutput(createdUser)
        res.status(HttpStatus.Created).send(userOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }

}