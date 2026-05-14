import { body } from 'express-validator';

const login = body('login')
  .notEmpty().withMessage('Login cannot be empty')
  .bail()
  .isString().withMessage('Login must be a string')
  .bail()
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('Login must be between 3 and 10 characters')
  .bail()
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('Login can only contain letters, numbers, underscores and hyphens')

const password = body('password')
  .notEmpty().withMessage('Password cannot be empty')
  .bail()
  .isString().withMessage('Password must be a string')
  .bail()
  .trim()
  .isLength({ min: 6 , max: 20 })
  .withMessage('Password must be between 6 and 20 characters')


export const email = body('email')
  .trim()
  .isEmail().withMessage('Email must be a valid email address')



export const userInputDtoValidation = [
  login,
  password,
  email,
];