import { body } from 'express-validator';

const newPassword = body('newPassword')
  .trim()
  .exists().withMessage('Password is required')
  .bail()
  .notEmpty().withMessage('Password cannot be empty')
  .bail()
  .isString().withMessage('Password must be a string')
  .bail()
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be between 6 and 20 characters')


const recoveryCode = body('recoveryCode')
  .isString()
  .withMessage('Recovery code must be a string')
  .notEmpty()
  .withMessage('Recovery code is required')

export const newPasswordRecoveryValidation = [
  newPassword,
  recoveryCode,
];
