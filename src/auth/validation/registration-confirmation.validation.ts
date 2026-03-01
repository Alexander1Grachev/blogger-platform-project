
import { body } from 'express-validator';

export const registrationConfirmationValidation = [
  body('code')
    .trim()
    .notEmpty().withMessage('Code is required')
    .isString().withMessage('Code must be a string')
];