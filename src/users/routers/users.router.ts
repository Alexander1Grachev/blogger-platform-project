import { Router } from "express";
import { UserSortField } from "./input/user-sort-field";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { getUserListHandler } from "./handlers/get-user-list.handler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { createUserHandler } from "./handlers/create-user.handler";
import { deleteUserHandler } from "./handlers/delete-user.handler";
import { userInputDtoValidation } from "../validation/user.input-dto.validation";


export const usersRouter = Router()

usersRouter
  .get('/',
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    inputValidationResultMiddleware,
    getUserListHandler,
  )
  .post('/',
    superAdminGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    createUserHandler,
  )
  .delete('/:id',
    superAdminGuardMiddleware,
    deleteUserHandler,
  )