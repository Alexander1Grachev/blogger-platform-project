import { body } from 'express-validator';

const loginOrEmail = body('loginOrEmail')
  .exists().withMessage('Login is required')
  .bail()
  .notEmpty().withMessage('Login cannot be empty')
  .bail()
  .isString().withMessage('Login must be a string')

const password = body('password')
  .exists().withMessage('Password is required')
  .bail()
  .notEmpty().withMessage('Password cannot be empty')
  .bail()
  .isString().withMessage('Password must be a string')

export const authInputDtoValidation = [
  loginOrEmail,
  password,
];