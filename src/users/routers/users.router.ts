import { Router } from "express";
import { UserSortField } from "./input/user-sort-field";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { userInputDtoValidation } from "../validation/user.input-dto.validation";
import { container } from "../../composition-root";

import { CreateUserController } from "./handlers/create-user.handler";
import { GetUserListController } from "./handlers/get-user-list.handler";
import { DeleteUseController } from "./handlers/delete-user.handler";

export const usersRouter = Router()

usersRouter
  .get('/',
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    inputValidationResultMiddleware,
    container.get(GetUserListController).handle,
  )
  .post('/',
    superAdminGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(CreateUserController).handle,
  )
  .delete('/:id',
    superAdminGuardMiddleware,
    container.get(DeleteUseController).handle,
  )