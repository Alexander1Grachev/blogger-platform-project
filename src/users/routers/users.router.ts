import { Router } from "express";
import { UserSortField } from "./input/user-sort-field";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { userInputDtoValidation } from "../validation/user.input-dto.validation";
import {
  createUserController,
  getUserListController,
  deleteUseController,
} from "../../composition-root";

export const usersRouter = Router()

usersRouter
  .get('/',
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    inputValidationResultMiddleware,
    getUserListController.handle,
  )
  .post('/',
    superAdminGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    createUserController.handle,
  )
  .delete('/:id',
    superAdminGuardMiddleware,
    deleteUseController.handle,
  )